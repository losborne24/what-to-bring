/*
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

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = 'userId';
const partitionKeyType = 'S';
const sortKeyName = 'topicId';
const sortKeyType = 'S';
const hasSortKey = sortKeyName !== '';
const path = '/vote';
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
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

app.get(path + hashKeyPath, function (req, res) {
  const queryParams = {
    TableName: tableName,
    Key: {
      userId: req.apiGateway.event.requestContext.authorizer.claims.sub,
      topicId: req.params[partitionKeyName],
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

app.post(path + '/downvote', function (req, res) {
  const isItemExists = checkIfItemExists(req);
  if (isItemExists) {
    const updateItemParams = {
      TableName: tableName,
      Key: {
        userId: req.apiGateway.event.requestContext.authorizer.claims.sub,
        topicId: req.body.topicId,
      },
      UpdateExpression: 'DELETE upvotes :upvote, ADD downvotes :downvote',
      ExpressionAttributeValues: {
        ':downvote': dynamodb.createSet([req.body.optionId]),
        ':upvote': dynamodb.createSet([req.body.optionId]),
      },
    };
    dynamodb.update(updateItemParams, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.json({ error: err, url: req.url, body: req.body });
      } else {
        res.json({ success: 'post call succeed!', url: req.url, data: data });
      }
    });
  } else {
    const updateItemParams = {
      TableName: tableName,
      Item: {
        userId: req.apiGateway.event.requestContext.authorizer.claims.sub,
        topicId: req.body.topicId,
        downvotes: dynamodb.createSet([req.body.optionId]),
      },
    };
    dynamodb.put(updateItemParams, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.json({ error: err, url: req.url, body: req.body });
      } else {
        res.json({ success: 'post call succeed!', url: req.url, data: data });
      }
    });
  }
});

const checkIfItemExists = (req) => {
  const params = {
    TableName: tableName,
    Key: {
      userId: req.apiGateway.event.requestContext.authorizer.claims.sub,
      topicId: req.body.topicId,
    },
  };
  let exists = false;
  dynamodb.get(params, (error, result) => {
    if (result.Item) exists = true;
    else exists = false;
  });
  return exists;
};

app.listen(3000, function () {
  console.log('App started');
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
