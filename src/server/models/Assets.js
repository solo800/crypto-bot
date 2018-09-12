const Model = require('./Model');

module.exports = class Assets extends Model {
    constructor (args) {
        super(args);
        this.tableName = 'Assets';

        this.create = this.create.bind(this);
        this.drop = this.drop.bind(this);
        this.save = this.save.bind(this);
        this.get = this.get.bind(this);
    }

    create () {
        return super.create(this.AssetsTableParams);
    }

    drop () {
        return super.drop(this.tableName);
    }

    save (assets) {
        return super.save(assets, this.tableName);
    }

    get () {
        const sortAttribute = 'data_trade_count';

        return new Promise((resolve, reject) => {
            super.scan({TableName: this.tableName})
                .then(result => resolve(super.sortItems(result, sortAttribute)))
                .catch(error => {
                    console.warn('Scan Assets table error', error);
                    reject(error);
                });
        });
    }
};