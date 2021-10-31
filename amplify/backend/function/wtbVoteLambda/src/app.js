/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_WTBOPTIONTABLE_ARN
	STORAGE_WTBOPTIONTABLE_NAME
	STORAGE_WTBOPTIONTABLE_STREAMARN
	STORAGE_WTBVOTETABLE_ARN
	STORAGE_WTBVOTETABLE_NAME
	STORAGE_WTBVOTETABLE_STREAMARN
Amplify Params - DO NOT EDIT */ /*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const AWS = require('aws-sdk');
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
var bodyParser = require('body-parser');
var express = require('express');

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = 'wtbVoteTable';
if (process.env.ENV && process.env.ENV !== 'NONE') {
  tableName = tableName + '-' + process.env.ENV;
}
let optionTableName = 'wtbOptionTable';
if (process.env.ENV && process.env.ENV !== 'NONE') {
  optionTableName = optionTableName + '-' + process.env.ENV;
}

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = 'userId';
const partitionKeyType = 'S';
const sortKeyName = 'topicId';
const sortKeyType = 'S';
const hasSortKey = sortKeyName !== '';
const path = '/vote';
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = '/:' + sortKeyName;
// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.get(path + sortKeyPath, function (req, res) {
  const queryParams = {
    TableName: tableName,
    Key: {
      userId: req.apiGateway.event.requestContext.authorizer.claims.sub,
      topicId: req.params[sortKeyName],
    },
  };
  dynamodb.get(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err });
    } else {
      res.json(data.Item);
    }
  });
});
const updateOptionItemVotes = async (req, voteDirection, isSwap) => {
  let updateExpression;
  if (isSwap) {
    updateExpression =
      voteDirection === 'DOWN'
        ? 'ADD downvotes :amount, upvotes :amountN'
        : 'ADD downvotes :amountN, upvotes :amount';
  } else {
    updateExpression =
      voteDirection === 'DOWN'
        ? 'ADD downvotes :amount'
        : 'ADD upvotes :amount';
  }
  const updateOptionItemParams = {
    TableName: optionTableName,
    Key: {
      topicId: req.body.topicId,
      optionId: req.body.optionId,
    },
    ReturnValues: 'ALL_NEW',
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: {
      ':amount': 1,
      ':amountN': -1,
    },
  };
  return await dynamodb.update(updateOptionItemParams).promise();
};

const getOptionRankNeighbour = async (req, optionRank) => {
  const params = {
    TableName: optionTableName,
    IndexName: 'topicId-optionRank-index',
    KeyConditionExpression: 'topicId = :topicId AND optionRank = :optionRank',
    ExpressionAttributeValues: {
      ':topicId': req.body.topicId,
      ':optionRank': optionRank,
    },
  };
  return await dynamodb.query(params).promise();
};
const checkIfVoteItemExists = async (req) => {
  const params = {
    TableName: tableName,
    Key: {
      userId: req.apiGateway.event.requestContext.authorizer.claims.sub,
      topicId: req.body.topicId,
    },
  };
  return await dynamodb.get(params).promise();
};
const updateUserVoteItem = async (req, voteDirection, userVoteItem) => {
  if (userVoteItem) {
    const _updateExpression =
      voteDirection === 'DOWN'
        ? 'DELETE upvotes :upvote ADD downvotes :downvote'
        : 'ADD upvotes :upvote DELETE downvotes :downvote';
    // update votes table
    const updateItemParams = {
      TableName: tableName,
      Key: {
        userId: req.apiGateway.event.requestContext.authorizer.claims.sub,
        topicId: req.body.topicId,
      },
      UpdateExpression: _updateExpression,
      ExpressionAttributeValues: {
        ':downvote': dynamodb.createSet([req.body.optionId]),
        ':upvote': dynamodb.createSet([req.body.optionId]),
      },
    };
    return await dynamodb.update(updateItemParams).promise();
  } else {
    // update votes table
    const _item =
      voteDirection === 'DOWN'
        ? {
            userId: req.apiGateway.event.requestContext.authorizer.claims.sub,
            topicId: req.body.topicId,
            downvotes: dynamodb.createSet([req.body.optionId]),
          }
        : {
            userId: req.apiGateway.event.requestContext.authorizer.claims.sub,
            topicId: req.body.topicId,
            upvotes: dynamodb.createSet([req.body.optionId]),
          };
    const updateItemParams = {
      TableName: tableName,
      Item: _item,
    };
    return await dynamodb.put(updateItemParams).promise();
  }
};
const checkNeighbour = async (req, voteDirection, optionItem) => {
  const optionRankNeighbourNo =
    voteDirection === 'DOWN'
      ? optionItem.optionRank + 1
      : optionItem.optionRank - 1;
  const optionItemNeighbour$ = await getOptionRankNeighbour(
    req,
    optionRankNeighbourNo
  );
  const optionItemNeighbour = optionItemNeighbour$?.Items[0]; // may be null
  let isChangeRank = false;
  if (optionItemNeighbour) {
    const itemCoEff = (optionItem.upvotes * 2) / (optionItem.downvotes + 100);
    const neighbourCoEff =
      (optionItemNeighbour.upvotes * 2) / (optionItemNeighbour.downvotes + 100);
    console.log({ itemCoEff });
    console.log({ neighbourCoEff });
    console.log({ voteDirection });

    if (
      (voteDirection === 'DOWN' && itemCoEff < neighbourCoEff) ||
      (voteDirection === 'UP' && itemCoEff > neighbourCoEff)
    ) {
      console.log('here');
      isChangeRank = true;
      const updateOptionItemParams = {
        TableName: optionTableName,
        Key: {
          topicId: optionItem.topicId,
          optionId: optionItem.optionId,
        },
        UpdateExpression: 'ADD optionRank :amount',
        ExpressionAttributeValues: {
          ':amount': voteDirection === 'DOWN' ? 1 : -1,
        },
      };
      await dynamodb.update(updateOptionItemParams).promise();

      const updateOptionItemNeighbourParams = {
        TableName: optionTableName,
        Key: {
          topicId: optionItemNeighbour.topicId,
          optionId: optionItemNeighbour.optionId,
        },
        UpdateExpression: 'ADD optionRank :amount',
        ExpressionAttributeValues: {
          ':amount': voteDirection === 'DOWN' ? -1 : 1,
        },
      };
      await dynamodb.update(updateOptionItemNeighbourParams).promise();
    }
  }
  return isChangeRank;
};

const updateVote = async (req, voteDirection) => {
  const userVoteItem$ = await checkIfVoteItemExists(req);
  const userVoteItem = userVoteItem$?.Item;
  const isSwap =
    voteDirection === 'DOWN'
      ? userVoteItem?.upvotes?.values.includes(req.body.optionId) || false
      : userVoteItem?.downvotes?.values.includes(req.body.optionId) || false;
  await updateUserVoteItem(req, voteDirection, userVoteItem);
  const optionItem$ = await updateOptionItemVotes(req, voteDirection, isSwap);
  const optionItem = optionItem$?.Attributes;
  return await checkNeighbour(req, voteDirection, optionItem);
};
app.post(path + '/downvote', async function (req, res) {
  const voteDirection = 'DOWN';
  const isChangeRank = await updateVote(req, voteDirection);
  res.json({ data: isChangeRank });
});
app.post(path + '/upvote', async function (req, res) {
  const voteDirection = 'UP';
  const isChangeRank = await updateVote(req, voteDirection);
  res.json({ data: isChangeRank });
});

app.listen(3000, function () {
  console.log('App started');
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
