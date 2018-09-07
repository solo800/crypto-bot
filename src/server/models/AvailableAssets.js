const assets = require('../../assets');

module.exports = class AvailableAssets  {
    constructor (db) {
        this.db = db;
    }

    createTable (db) {
        return new Promise((resolve, reject) => {
            const params = {
                TableName: 'AvailableAssets',
                KeySchema: [
                    {AttributeName: 'asset_id', KeyType: 'HASH'},
                    {AttributeName: 'name', KeyType: 'RANGE'},
                ],
                AttributeDefinitions: [
                    {AttributeName: 'asset_id', AttributeType: 'S'},
                    {AttributeName: 'name', AttributeType: 'S'},
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 10,
                    WriteCapacityUnits: 10,
                },
            };

            db.createTable(params, (err, data) => {
                if (!err) {
                    console.log('we created a table', data);
                    resolve(data);
                } else {
                    console.log('we failed', err);
                    reject(err);
                }
            });
        });
    }

    describeTable (db) {
        return new Promise((resolve, reject) => {
            const params = {
                TableName: 'AvailableAssets',
            };

            db.describeTable(params, (err, data) => {
                if (!err) {
                    console.log('found table', data);
                    resolve(data);
                } else {
                    console.log('did not find table', err);
                    reject(err);
                }
            });
        });
    }

    saveAssets (db) {
        return new Promise((resolve, reject) => {
            const allAvailableAssets = assets
                .filter(crypto => 1 === crypto.type_is_crypto)
                .map(crypto => {
                    let Item = {
                        asset_id: {S: crypto.asset_id},
                        name: {S: crypto.name},
                    };

                    return {PutRequest: {Item}};
                });

            let AvailableAssets = [];
            allAvailableAssets.forEach(asset => {
                if (25 > AvailableAssets.length) {
                    AvailableAssets.push(asset);
                } else if (25 === AvailableAssets.length) {
                    db.batchWriteItem({RequestItems: {AvailableAssets}}, (err, data) => {
                        if (!err) {
                            console.log('write successful');
                        } else {
                            console.log('error', err);
                        }
                    });
                    AvailableAssets = [];
                }
            });
        });
    }

    getAssets (db) {
        return new Promise((resolve, reject) => {
            const params = {
                TableName: 'AvailableAssets',
                // ExpressionAttributeNames: {
                //     S: 'name',
                // },
                // ExpressionAttributeValues: {
                //     ':a': {
                //         S: 'BTC',
                //     }
                // }
            };

            db.scan(params, (err, data) => {
                if (!err) {
                    resolve(data);
                } else {
                    reject(err);
                }
            });
        });
    }
};