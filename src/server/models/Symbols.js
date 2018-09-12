const Model = require('./Model');

module.exports = class Symbols extends Model {
    constructor (args) {
        super(args);
        this.tableName = 'Symbols';

        this.create = this.create.bind(this);
        this.drop = this.drop.bind(this);
        this.save = this.save.bind(this);
        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDataAndSave = this.getDataAndSave.bind(this);
    }

    create () {
        return super.create(this.SymbolsTableParams);
    }

    drop () {
        return super.drop(this.tableName);
    }

    save (symbols) {
        return super.save(symbols, this.tableName);
    }

    get (asset, exchange) {
        return new Promise((resolve, reject) => {
            const params = {
                TableName: this.tableName,
                Key: {
                    symbol_id: `${exchange}_SPOT_${asset}_USD`,
                    asset_id_base: asset,
                },
            };
            this.docClient.get(params, (error, data) => {
                if (!error) {
                    resolve(data);
                } else {
                    reject(error);
                }
            })
        });
    }

    getAll () {
        return new Promise((resolve, reject) => {
            super.scan({TableName: this.tableName})
                .then(result => resolve(result))
                .catch(error => {
                    console.warn('Scan Symbols table error', error.code);

                    if ('ResourceNotFoundException' === error.code) {
                        console.log('got the exception');
                        // create the table and try the scan again
                        this.create()
                            .then(result => {
                                console.log('was the table created?', result);
                                resolve(result);
                            })
                            .catch(error => reject(error));
                    } else {
                        reject(error);
                    }
                });
        });
    }

    getDataAndSave () {
        console.log('in getdandsave of sym');
        return new Promise((resolve, reject) => {
            this.getAll()
                .then(result => {
                    console.log('get all of result', result.data.length);
                    resolve(result.data);
                    // this.save(result.data, this.tableName)
                    //     .then(result => {
                    //         console.log('in result of save', result);
                    //         resolve(result.data);
                    //     })
                    //     .catch(error => reject(error));
                })
                .catch(error => reject(error));
        });
    }
};