const DynamoDB = require('aws-sdk/clients/dynamodb');

exports.handler = async function(event, context, callback) {
  const db = new DynamoDB.DocumentClient();
  console.log('event', JSON.stringify(event, null, 2))
  var putParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      Id: event.requestContext.connectionId,
    }
  };

  console.log('connecting...')
  try {
    await db.put(putParams).promise();

    console.log('connected!')
    return {
      statusCode: 200,
      body: "Connected"
    }
  } catch (e) {
    console.error('error!', e);
    return {
      statusCode: 501,
      body: "Failed to connect: " + JSON.stringify(e),
    };
  }
};