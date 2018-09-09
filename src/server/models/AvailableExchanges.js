const Model = require('./Model');

module.exports = class AvailableAssets extends Model {
    constructor (args) {
        super(args);
        this.tableName = 'AvailableExchanges';

        this.create = this.create.bind(this);
    }

    create () {
        const params = {
            TableName: this.tableName,
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

        return super.create(params);
    }

    save (exchanges) {
        return super.save(exchanges, this.tableName);
    }

    get () {
        const sortAttribute = 'data_trade_count';

        return new Promise((resolve, reject) => {
            super.scan({TableName: this.tableName})
                .then(result => {
                    resolve(super.sortItems(result, sortAttribute));
                })
                .catch(error => {
                    reject(error);
                })
        });
    }
};