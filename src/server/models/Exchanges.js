const Model = require('./Model');

module.exports = class Exchanges extends Model {
    constructor (args) {
        super(args);
        this.tableName = 'Exchanges';

        this.create = this.create.bind(this);
        this.save = this.save.bind(this);
        this.get = this.get.bind(this);
    }

    create () {
        return super.create(this.ExchangesTableParams);
    }

    save (exchanges) {
        return super.save(exchanges, this.tableName);
    }

    get () {
        const sortAttribute = 'data_trade_count';

        return new Promise((resolve, reject) => {
            super.scan({TableName: this.tableName})
                .then(result => resolve(super.sortItems(result, sortAttribute)))
                .catch(error => {
                    console.warn('Scan Exchanges table error', error);
                    reject(error);
                });
        });
    }
};