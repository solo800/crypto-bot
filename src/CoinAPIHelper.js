const axios = require('axios');
const Utility = require('./Utility');

class CoinAPIHelper {
    constructor () {
        this.key = '8202B531-8496-495C-95AD-248D08A33937';
        this.hostname = 'https://rest.coinapi.io/v1/';

        this.buildAPIURL = this.buildAPIURL.bind(this);
        this.get = this.get.bind(this);
    }

    buildAPIURL (endpoint, params) {
        const util = new Utility();

        params = !util.checkType(params, 'array') ? [] : params;

        let apiKey = params.filter(param => 'apiKey' === param.key);

        if (1 !== apiKey.length) {
            params.push({
                key: 'apikey',
                value: this.key,
            });
        }

        return params.reduce((url, param) => {
            return url + `${param.key}=${param.value}&`;
        }, `${this.hostname}${endpoint}?`);
    }

    get (endpoint, params) {
        console.log('utl', this.buildAPIURL(endpoint, params), endpoint, params);
        return axios.get(this.buildAPIURL(endpoint, params));
    }
}

module.exports = CoinAPIHelper;