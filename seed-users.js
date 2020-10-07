const DynamoDB = require('aws-sdk/clients/dynamodb');

const times = (x, fn) => Array.from(Array(x).keys()).map(fn);

const run = async () => {
  const db = new DynamoDB.DocumentClient();
  await Promise.all(times(10, (i) =>
    db.put({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: {
        RecordId: `User:${i}`,
        Name: `User Name ${i}`,
      }
    }).promise()
  ))
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