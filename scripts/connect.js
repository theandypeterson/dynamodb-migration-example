const DynamoDB = require('aws-sdk/clients/dynamodb');

exports.handler = async function(event, context, callback) {
  const db = new DynamoDB.DocumentClient();
  var putParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      Id: event.requestContext.connectionId,
    }
  };

  try {
    await db.put(putParams).promise();

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