const DynamoDB = require('aws-sdk/clients/dynamodb');

const up = async () => {
  const db = new DynamoDB.DocumentClient();
  let lastEvalKey;
  do {
    const { Items, LastEvaluatedKey } = await db.scan({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      FilterExpression: 'begins_with(RecordId, :x)',
      ExclusiveStartKey: lastEvalKey,
      ExpressionAttributeValues: {
        ':x': 'User:'
      }
    }).promise();
    lastEvalKey = LastEvaluatedKey;
    const updatedItems = Items.map((item) => {
      return {
        ...item,
        status: 'Active',
      };
    });
    await Promise.all(updatedItems.map((item) =>
      db.put({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: item,
      }).promise()
    ));
  } while(lastEvalKey)
}

const down = async () => {
  const db = new DynamoDB.DocumentClient();
  let lastEvalKey;
  do {
    const { Items, LastEvaluatedKey } = await db.scan({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      FilterExpression: 'begins_with(RecordId, :x)',
      ExclusiveStartKey: lastEvalKey,
      ExpressionAttributeValues: {
        ':x': 'User:'
      }
    }).promise();
    lastEvalKey = LastEvaluatedKey;
    const updatedItems = Items.map((item) => {
      const { status, ...rest } = item;
      return rest;
    });
    await Promise.all(updatedItems.map((item) =>
      db.put({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: item,
      }).promise()
    ));
  } while(lastEvalKey)
}

module.exports = {
  up,
  down,
};