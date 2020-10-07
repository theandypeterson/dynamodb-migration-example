const DynamoDB = require('aws-sdk/clients/dynamodb');

const run = async () => {
  const db = new DynamoDB.DocumentClient()
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
    await Promise.all(Items.map((item) =>
      db.delete({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: {
          RecordId: item.RecordId,
        },
      }).promise()
    ));
  } while(lastEvalKey)
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