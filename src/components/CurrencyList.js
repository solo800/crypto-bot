import React from 'react';
// import axios from 'axios';
import assetsList from '../assets';
import Currency from './Currency';

class CurrencyList extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            assetsList: [],
        };
        this.restAPI = 'https://rest.coinapi.io/v1/';
        this.apiKey = '8202B531-8496-495C-95AD-248D08A33937';

        // this.get = this.get.bind(this);
        this.setSelectedCurrency = this.setSelectedCurrency.bind(this);
    }

    // custom methods
    // async get (currencyRef) {
    //     console.log('curr ref', currencyRef);
    //     let d;
    //     await axios.get(`https://rest.coinapi.io/v1/exchangerate${currencyRef}?apikey=8202B531-8496-495C-95AD-248D08A33937`, {
    //             Accept: 'application/json',
    //             'Accept-Encoding': 'deflate, gzip',
    //         })
    //         .then(res => {
    //             console.log('res', res);
    //             d = res;
    //         })
    //         .catch(err => {
    //             console.log('err', err);
    //             d = err;
    //         });
    //
    //     return d;
    // }

    setSelectedCurrency (currencyID = null, currencyName = null) {
        if (null !== currencyID) {

        } else if (null !== currencyName) {

        } else {
            return false;
        }
    }

    // lifecycle methods
    componentDidMount () {
        console.log('assets are', assetsList);
        console.log('params', window.location.pathname);

        // this.setState({assetsList}, () => {
        //     console.log('pathname', window.location.pathname);
        //     // this.setSelectedCurrency(window.location.pathname);
        // });
    }

    // add (x) {
    //     return new Promise((res, rej) => {
    //         window.setTimeout(() => {
    //             res(x * 2);
    //         }, 4000);
    //     });
    // }
    //
    // async addNum (x) {
    //     return await this.add(x);
    // }

    render () {
        return (
            <div>
                <select>
                    {
                        this.state.assetsList
                            .filter(asset => 1 === asset.type_is_crypto)
                            .map(asset => <Currency {...asset} />)
                    }
                </select>
            </div>
        );
    }
}

export default CurrencyList;