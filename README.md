# DynamoDB Migration Example

This repository demonstrates basic usages of DynamoDB by migrating data structures.

Example for this blog post: https://spin.atomicobject.com/2020/10/20/dynamodb-migrate-data-structures/

## How to run

* Setup your AWS credentials: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html
  * Make sure to setup a DynamoDB table and set `DYNAMODB_TABLE_NAME` to that table's name.
* Run `yarn install` to install dependencies.
* Run `yarn seed` to add User records to DynamoDB.
* Run `yarn migrate` to run through all current migrations.
  * Run `yarn up` to run the next individual migration
* Run `yarn rollback` to undo last batch of migrations
  * Run `yarn down` to undo the last migration.
