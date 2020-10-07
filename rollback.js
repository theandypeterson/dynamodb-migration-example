const fs = require('fs');
const { revert, getLatestBatch, removeBatch } = require('./helpers');

const run = async () => {
  const latestBatch = await getLatestBatch();
  if (!latestBatch) {
    return;
  }
  console.log('latestBatch', latestBatch);
  const migrationFiles = fs.readdirSync('./migrations');
  const migrations = migrationFiles.map((fileName) => require(`./migrations/${fileName}`))
    .sort((a, b) => b.sequence - a.sequence)
    .filter((migration) => latestBatch.sequences.includes(migration.sequence));
  for (const migration of migrations) {
    console.log('reverting: ', migration.sequence)
    await revert(migration.down);
  }
  await removeBatch(latestBatch.batchNumber);
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