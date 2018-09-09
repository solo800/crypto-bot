const axios = require('axios');

class CoinAPIHelper {
    constructor () {
        this.key = '8202B531-8496-495C-95AD-248D08A33937';
        this.domain = 'https://rest.coinapi.io/v1/';

        this.buildAPIURL = this.buildAPIURL.bind(this);
        this.get = this.get.bind(this);
    }

    buildAPIURL (endpoint) {
        return `${this.domain}${endpoint}/?apikey=${this.key}`;
    }

    get (endpoint) {
        return axios.get(this.buildAPIURL(endpoint));
    }
}

module.exports = CoinAPIHelper;