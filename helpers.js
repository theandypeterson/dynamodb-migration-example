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

const checkForMigrationSequence = async (sequence) => {
  const db = new DynamoDB.DocumentClient();
  const { Item } = await db.get({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      RecordId: 'Migrations'
    },
  }).promise();
  return Item && Object.values(Item.Batches).reduce((acc, val) => acc.concat(val), []).includes(sequence);
}

const setMigrationIsRun = async (batch, sequence) => {
  const db = new DynamoDB.DocumentClient();
  const { Item } = await db.get({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      RecordId: 'Migrations'
    },
  }).promise();
  console.log('Item', Item);
  const existingBatches = Item ? Item.Batches : {};
  console.log('existingBatches', existingBatches);
  const batchToUpdate = existingBatches[batch] || [];
  batchToUpdate.push(sequence);
  const updatedItem = {
    ...Item,
    RecordId: 'Migrations',
    Batches: {
      ...existingBatches,
      [batch]: batchToUpdate,
    }
  }
  console.log('updatedItem', updatedItem);
  await db.put({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: updatedItem,
  }).promise()
}

const getLatestBatch = async () => {
  const db = new DynamoDB.DocumentClient();
  const { Item } = await db.get({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      RecordId: 'Migrations'
    },
  }).promise();
  if (!Item) {
    return;
  }
  console.log('Item.Batches', Item.Batches);
  const batches = Object.keys(Item.Batches).map((x) => parseInt(x, 10)).sort().reverse();
  console.log('batches', batches);
  const latestBatchNumber = batches[0];
  console.log('latestBatchNumber', latestBatchNumber);
  if (!latestBatchNumber) {
    return;
  }
  return {
    batchNumber: latestBatchNumber,
    sequences: Item.Batches[latestBatchNumber],
  }
};

const removeBatch = async (batch) => {
  const db = new DynamoDB.DocumentClient();
  const { Item } = await db.get({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      RecordId: 'Migrations'
    },
  }).promise();
  if (!Item) {
    return;
  }
  const currentBatches = Item.Batches;
  delete currentBatches[`${batch}`];
  const updatedItem = {
    ...Item,
    RecordId: 'Migrations',
    Batches: currentBatches
  };
  await db.put({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: updatedItem,
  }).promise();
}

const migrate = async (batch, sequence, updateFn) => {
  const isMigrationRun = await checkForMigrationSequence(sequence);
  if (!isMigrationRun) {
    await applyUpdateToAllUsers(updateFn);
    await setMigrationIsRun(batch, sequence);
  } else {
    console.log('Skipping ', sequence);
  }
}

const revert = async (updateFn) => {
  await applyUpdateToAllUsers(updateFn);
}

module.exports = {
  migrate,
  revert,
  getLatestBatch,
  removeBatch,
};