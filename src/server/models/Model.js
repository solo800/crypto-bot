const CoinAPIHelper = require('../../CoinAPIHelper');

module.exports = class Model {
    constructor ({db, docClient}) {
        this.db = db;
        this.docClient = docClient;
        this.AssetsTableParams = {
            TableName: 'Assets',
            KeySchema: [
                {
                    AttributeName: 'asset_id',
                    KeyType: 'HASH',
                },
                {
                    AttributeName: 'name',
                    KeyType: 'RANGE',
                },
            ],
            AttributeDefinitions: [
                {
                    AttributeName: 'asset_id',
                    AttributeType: 'S',
                },
                {
                    AttributeName: 'name',
                    AttributeType: 'S',
                },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10,
            },
        };
        this.ExchangesTableParams = {
            TableName: 'Exchanges',
            KeySchema: [
                {
                    AttributeName: 'exchange_id',
                    KeyType: 'HASH',
                },
                {
                    AttributeName: 'name',
                    KeyType: 'RANGE',
                },
            ],
            AttributeDefinitions: [
                {
                    AttributeName: 'exchange_id',
                    AttributeType: 'S',
                },
                {
                    AttributeName: 'name',
                    AttributeType: 'S',
                },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10,
            },
        };
        this.SymbolsTableParams = {
            TableName: 'Symbols',
            KeySchema: [
                {
                    AttributeName: 'symbol_id',
                    KeyType: 'HASH',
                },
                // {
                //     AttributeName: 'asset_id_base',
                //     KeyType: 'RANGE',
                // },
            ],
            AttributeDefinitions: [
                {
                    AttributeName: 'symbol_id',
                    AttributeType: 'S',
                },
                // {
                //     AttributeName: 'asset_id_base',
                //     AttributeType: 'S',
                // },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10,
            },
        };

        this.create = this.create.bind(this);
        this.drop = this.drop.bind(this);
        this.describe = this.describe.bind(this);
        this.save = this.save.bind(this);
        this.sortItems = this.sortItems.bind(this);
        this.scan = this.scan.bind(this);
        this.coinAPIGet = this.coinAPIGet.bind(this);
        this.getDataAndSave = this.getDataAndSave.bind(this);
    }

    create (params) {
        console.log('creating', params, this);
        return new Promise((resolve, reject) => {
            this.db.createTable(params, (error, result) => {
                if (!error) {
                    resolve(result);
                } else {
                    reject(error);
                }
            });
        });
    }

    drop (tableName) {
        return new Promise((resolve, reject) => {
            this.db.deleteTable({TableName: tableName}, (error, data) => {
                if (!error) {
                    resolve(data);
                } else {
                    reject(error);
                }
            });
        });
    }

    describe (tableName) {
        return new Promise((resolve, reject) => {
            this.db.describeTable({TableName: tableName}, (err, data) => {
                if (!err) {
                    resolve(data);
                } else {
                    reject(err);
                }
            });
        });
    }

    save (data, tableName) {

        let items;
        let itemsCount = 0;

        const promises = [];
        while (0 < data.length) {
            items = data.splice(0, 25).map(Item => {
                return {PutRequest: {Item}};
            });

            promises.push(new Promise((resolve, reject) => {
                this.docClient.batchWrite({RequestItems: {[tableName]: items}}, (error, result) => {
                    if (error) {
                        console.warn('error writing', items);
                        reject(error);
                    } else {
                        try {
                            let coinbase = items.filter(i => {
                                if (undefined === i.PutRequest.Item.exchange_id) {
                                    console.log('no ex id', i);
                                }
                                return -1 < i.PutRequest.Item.exchange_id.indexOf('coinbase');
                            });

                            if (coinbase.length > 0) console.log(coinbase);
                        } catch (e) {
                            console.log('error filtering', e);
                        }
                    }
                });

                resolve(true);
            }));

            itemsCount += items.length;
        }

        console.log(`Attempting to write ${itemsCount} items to db`);
        return Promise.all(promises);
    }

    sortItems (data, sortAttribute) {
        return data.sort((prev, next) => next[sortAttribute] - prev[sortAttribute]);
    }

    scan (params) {
        return new Promise((resolve, reject) => {
            this.docClient.scan(params, (error, data) => {
                if (!error) {
                    if (0 < data.Items.length) {
                        resolve(data.Items);
                    } else {
                        // no items but table exists, probably need to get this from coinapi
                        resolve(this.getDataAndSave(params.TableName.toLowerCase(), params.TableName));
                    }
                } else {
                    console.warn(`Scan failed for ${params.TableName}, table probably doesn't exist`);
                    reject(error);
                }
            });
        })
    }

    coinAPIGet (endpoint) {
        const coinapi = new CoinAPIHelper();
        return coinapi.get(endpoint);
    }

    getDataAndSave (endpoint, tableName) {
        return new Promise((resolve, reject) => {
            this.coinAPIGet(endpoint)
                .then(result => {
                    this.save(result.data, tableName)
                        .then(result => resolve(result.data))
                        .catch(error => {
                            console.warn(error);
                            console.warn('Error saving data from coinapi', tableName);
                            reject(error);
                        });
                })
                .catch(error => {
                    console.warn(error);
                    console.warn('Error getting data from coinapi', tableName);
                    reject(error);
                });
        });
    }
};