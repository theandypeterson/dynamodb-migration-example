const fs = require('fs');

const run = async () => {
  const migrationFiles = fs.readdirSync('./migrations');
  const migrations = migrationFiles.map((fileName) => require(`./migrations/${fileName}`)).sort((a, b) => b.sequence - a.sequence);
  for (const migration of migrations) {
    console.log('migrating: ', migration.sequence)
    await migration.down();
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