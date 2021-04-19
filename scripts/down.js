
const fs = require('fs');
const { revert, getLatestBatch, removeSequenceFromBatch } = require('./helpers');

const run = async () => {
  const latestBatch = await getLatestBatch();
  if (!latestBatch) {
    return;
  }
  const lastSequence = latestBatch.sequences.sort().reverse()[0];
  const migrationFiles = fs.readdirSync('./migrations');
  const migrations = migrationFiles.map((fileName) => require(`./migrations/${fileName}`))
    .sort((a, b) => a.sequence - b.sequence)
    .filter(x => x.sequence === lastSequence);
  for (const migration of migrations) {
    console.log('reverting: ', migration.sequence)
    await revert(migration.down);
  }
  await removeSequenceFromBatch(latestBatch.batchNumber, lastSequence);
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