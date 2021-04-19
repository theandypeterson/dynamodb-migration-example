const DynamoDB = require('aws-sdk/clients/dynamodb');

const run = async () => {
  const db = new DynamoDB.DocumentClient()
  await db.put({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: {
      RecordId: 'test-1',
      Something: 'here',
    }
  }).promise();
}

const main = () => {
  return run().then(() => {
    console.info('success');
    process.exit(0);
  }).catch((e) => {
    console.error('error: ', e);
    process.exit(1);
  });
}

main();