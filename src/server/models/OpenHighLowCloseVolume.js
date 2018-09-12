const Model = require('./Model');
const CoinAPIHelper = require('../../CoinAPIHelper');

module.exports = class OpenHighLowCloseVolume extends Model {
    constructor (args) {
        super(args);
        this.tableName = 'ExchangeRates';

        this.get = this.get.bind(this);
    }

    get (symbol, startDateString, endDateString) {
        return new Promise((resolve, reject) => {
            const coinapi = new CoinAPIHelper();

            const startDate = new Date(startDateString);
            const endDate = new Date(endDateString);
            const params = [
                {
                    key: 'period_id',
                    value: '1DAY',
                },
                {
                    key: 'time_start',
                    value: startDate.toISOString(),
                },
                {
                    key: 'time_end',
                    value: endDate.toISOString(),
                },
            ];

            coinapi.get(`ohlcv/${symbol}/history`, params)
                .then(result => {
                    console.log('result in ohlcv', result);
                    resolve(result);
                })
                .catch(error => {
                    console.log('error in ohlcv', error);
                    reject(error);
                });

            console.log('in exRate', symbol, startDateString, endDateString);
        });
    }
}