const DynamoDB = require('aws-sdk/clients/dynamodb');

const applyUpdateToAllUsers = async (updateFn) => {
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
    const updatedItems = Items.map(updateFn);
    await Promise.all(updatedItems.map((item) =>
      db.put({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: item,
      }).promise()
    ));
  } while(lastEvalKey)
}

const migrate = async (updateFn) => {
  await applyUpdateToAllUsers(updateFn);
}

const revert = async (updateFn) => {
  await applyUpdateToAllUsers(updateFn);
}

module.exports = {
  migrate,
  revert,
};