const ApiGatewayManagementApi = require('aws-sdk/clients/apigatewaymanagementapi');
const DynamoDB = require('aws-sdk/clients/dynamodb');

const { TABLE_NAME, ENDPOINT } = process.env;

exports.handler = async function(event, context, callback) {
  console.log("adfsijoadfsijoadfsijo", JSON.stringify(event, null, 2));
  const db = new DynamoDB.DocumentClient();
  let connections;

  try {
    connections = await db.scan({ TableName: TABLE_NAME, ProjectionExpression: 'Id' }).promise();
    console.log('connections', connections);
  } catch (e) {
    console.log('sad', e);
    return { statusCode: 500, body: e.stack };
  }

  const apigwManagementApi = new ApiGatewayManagementApi({
    // apiVersion: '2018-11-29',
    endpoint: ENDPOINT,
  });

  const postCalls = connections.Items.map(async ({ Id }) => {
    await apigwManagementApi.postToConnection({ ConnectionId: Id, Data: JSON.stringify(event) }).promise();
  });

  try {
    console.log('doing things...');
    await Promise.all(postCalls);
    console.log('DONE');
  } catch (e) {
    console.log('sad again', e)
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: 'Event sent.' };
};