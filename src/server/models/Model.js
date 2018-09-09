const CoinAPIHelper = require('../../CoinAPIHelper');

module.exports = class Model {
    constructor ({db, docClient}) {
        this.db = db;
        this.docClient = docClient;

        this.create = this.create.bind(this);
        this.drop = this.drop.bind(this);
        this.describe = this.describe.bind(this);
        this.save = this.save.bind(this);
        this.sortItems = this.sortItems.bind(this);
        this.scan = this.scan.bind(this);
        this.coinAPIGet = this.coinAPIGet.bind(this);
    }

    create (params) {
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
                console.log('in server', err, data);
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

        return new Promise((resolve, reject) => {
            items = data.splice(0, 25).map(Item => {
                return {PutRequest: {Item}};
            });

            this.docClient.batchWrite({RequestItems: {[tableName]: items}}, (error, result) => {
                if (error) {
                    reject(error);
                }
            });

            resolve(true);
        });
    }

    sortItems (data, sortAttribute) {
        return data.sort((prev, next) => next[sortAttribute] - prev[sortAttribute]);
    }

    scan (params) {
        return new Promise((resolve, reject) => {
            this.docClient.scan(params, (error, data) => {
                if (!error) {
                    resolve(data.Items);
                } else {
                    reject(error);
                }
            });
        })
    }

    coinAPIGet (endpoint) {
        const coinapi = new CoinAPIHelper();
        return coinapi.get(endpoint);
    }
};