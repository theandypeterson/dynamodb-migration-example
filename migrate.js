const fs = require('fs');

const run = async () => {
  const migrationFiles = fs.readdirSync('./migrations');

  console.log('migrationFiles', migrationFiles)
  for (const fileName of migrationFiles) {
    const migration = require(`./migrations/${fileName}`);
    await migration.up();
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