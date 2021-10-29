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
const updateOptionItemVotes = async (req, path, isSwap) => {
  let updateExpression;
  if (isSwap) {
    updateExpression =
      path === 'downvote'
        ? 'ADD downvotes :amount ADD upvotes :amount'
        : 'ADD downvotes :amount ADD upvotes :amount';
  } else {
    updateExpression =
      path === 'downvote' ? 'ADD downvotes :amount' : 'ADD upvotes :amount';
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
  console.log({ params });
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
app.post(path + '/downvote', async function (req, res) {
  const userVoteItem$ = await checkIfVoteItemExists(req);
  const userVoteItem = userVoteItem$?.Item;
  console.log({ userVoteItem$, userVoteItem });
  const isSwap = userVoteItem?.upvotes?.has(req.body.optionId) || false;
  console.log({ isSwap });
  if (userVoteItem) {
    // update votes table
    const updateItemParams = {
      TableName: tableName,
      Key: {
        userId: req.apiGateway.event.requestContext.authorizer.claims.sub,
        topicId: req.body.topicId,
      },
      UpdateExpression: 'DELETE upvotes :upvote ADD downvotes :downvote',
      ExpressionAttributeValues: {
        ':downvote': dynamodb.createSet([req.body.optionId]),
        ':upvote': dynamodb.createSet([req.body.optionId]),
      },
    };
    await dynamodb.update(updateItemParams).promise();
  } else {
    // update votes table
    const updateItemParams = {
      TableName: tableName,
      Item: {
        userId: req.apiGateway.event.requestContext.authorizer.claims.sub,
        topicId: req.body.topicId,
        downvotes: dynamodb.createSet([req.body.optionId]),
      },
    };
    await dynamodb.put(updateItemParams).promise();
  }
  const optionItem$ = await updateOptionItemVotes(req, 'downvote', isSwap);
  const optionItem = optionItem$?.Attributes;
  console.log({ optionItem$, optionItem });

  const optionItemBelow$ = await getOptionRankNeighbour(
    req,
    optionItem.optionRank + 1
  );
  const optionItemBelow = optionItemBelow$?.Items[0]; // may be null
  let isChangeRank = false;
  if (optionItemBelow) {
    const itemCoEff = (optionItem.upvotes * 2) / (optionItem.downvotes + 100);
    const belowCoEff =
      (optionItemBelow.upvotes * 2) / (optionItemBelow.downvotes + 100);
    console.log({ itemCoEff, belowCoEff });
    if (itemCoEff < belowCoEff) {
      isChangeRank = true;
      const updateOptionItemParams = {
        TableName: optionTableName,
        Key: {
          topicId: optionItem.topicId,
          optionId: optionItem.optionId,
        },
        UpdateExpression: 'ADD optionRank :amount',
        ExpressionAttributeValues: {
          ':amount': 1,
        },
      };
      await dynamodb.update(updateOptionItemParams).promise();

      const updateOptionItemBelowParams = {
        TableName: optionTableName,
        Key: {
          topicId: optionItemBelow.topicId,
          optionId: optionItemBelow.optionId,
        },
        UpdateExpression: 'ADD optionRank :amount',
        ExpressionAttributeValues: {
          ':amount': -1,
        },
      };
      await dynamodb.update(updateOptionItemBelowParams).promise();
    }
  }
  res.json({ data: isChangeRank });
});
/*app.post(path + '/downvote', function (req, res) {
  const userVoteItem = checkIfVoteItemExists(req);
  console.log({ userVoteItem });
  const isSwap = userVoteItem?.upvotes?.has(req.body.optionId) || false;
  console.log({ isSwap });
  if (userVoteItem) {
    // update votes table
    const updateItemParams = {
      TableName: tableName,
      Key: {
        userId: req.apiGateway.event.requestContext.authorizer.claims.sub,
        topicId: req.body.topicId,
      },
      UpdateExpression: 'DELETE upvotes :upvote ADD downvotes :downvote',
      ExpressionAttributeValues: {
        ':downvote': dynamodb.createSet([req.body.optionId]),
        ':upvote': dynamodb.createSet([req.body.optionId]),
      },
    };
    dynamodb.update(updateItemParams, (err, data) => {
      console.log({ updateItem: data });
    });
  } else {
    // update votes table
    const updateItemParams = {
      TableName: tableName,
      Item: {
        userId: req.apiGateway.event.requestContext.authorizer.claims.sub,
        topicId: req.body.topicId,
        downvotes: dynamodb.createSet([req.body.optionId]),
      },
    };
    dynamodb.put(updateItemParams, (err, data) => {
      console.log({ updateItemV2: data });
    });
  }

  const optionItem = updateOptionItemVotes(req, 'downvote', isSwap);
  console.log({ optionItem });

  const optionItemBelow = getOptionRankNeighbour(
    req,
    optionItem.optionRank + 1
  ); // may be null
  console.log({ optionItemBelow });

  let isChangeRank = false;
  if (optionItemBelow) {
    const itemCoEff = (optionItem.upvotes * 2) / (optionItem + 100);
    const belowCoEff = (optionItemBelow.upvotes * 2) / (optionItemBelow + 100);
    console.log({ itemCoEff, belowCoEff });
    if (itemCoEff < belowCoEff) {
      isChangeRank = true;
      const updateOptionItemParams = {
        TableName: optionTableName,
        Key: {
          topicId: optionItem.topicId,
          optionId: optionItem.optionId,
        },
        UpdateExpression: 'SET optionRank = optionRank + :r',
        ExpressionAttributeValues: {
          ':r': { N: '1' },
        },
      };
      dynamodb.update(updateOptionItemParams, (err, data) => {});

      const updateOptionItemBelowParams = {
        TableName: optionTableName,
        Key: {
          topicId: optionItemBelow.topicId,
          optionId: optionItemBelow.optionId,
        },
        UpdateExpression: 'SET optionRank = optionRank - :r',
        ExpressionAttributeValues: {
          ':r': { N: '1' },
        },
      };
      dynamodb.update(updateOptionItemBelowParams, (err, data) => {});
    }
    res.json({ data: isChangeRank });
  }
});
*/

app.listen(3000, function () {
  console.log('App started');
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
