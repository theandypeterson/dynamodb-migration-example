const fs = require('fs');
const { migrate } = require('./helpers');

const run = async () => {
  const migrationFiles = fs.readdirSync('./migrations');
  const migrations = migrationFiles.map((fileName) => require(`./migrations/${fileName}`)).sort((a, b) => a.sequence - b.sequence);
  for (const migration of migrations) {
    console.log('migrating: ', migration.sequence)
    await migrate(migration.up);
  }
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