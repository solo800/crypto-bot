import React from 'react';
import Utility from '../Utility';
import AppCon from './styles';
import axios from 'axios';
import List from './List';

class App extends React.Component {
    constructor (props) {
        super(props);

        const util = new Utility();

        this.state = {
            availableAssets: [],
            availableExchanges: [],
            selectedAsset: '',
            selectedExchange: '',
            startDate: util.formatDate('yyyy-mm-dd', new Date(new Date().getTime() - (86400000 * 2))),
            endDate: util.formatDate('yyyy-mm-dd', new Date(new Date().getTime() - 86400000)),
        };

        this.getAssetsAndExchanges = this.getAssetsAndExchanges.bind(this);
        this.assetExchangeMapper = this.assetExchangeMapper.bind(this);
        this.getOHLCV = this.getOHLCV.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.updateSelectedItem = this.updateSelectedItem.bind(this);
    }

    // custom methods
    assetExchangeMapper (asset, valueAttribute) {
        return {
            value: asset[valueAttribute],
            name: asset.name,
            selected: asset.selected,
        };
    }

    async getAssetsAndExchanges () {
        const lists = await Promise.all([axios.get('assets/get'), axios.get('exchanges/get')])
            .then(results => results.map(result => result.data))
            .catch(error => {
                console.log('Error getting assets and exchages', error);
            });

        return lists;
    }

    // event handlers
    async getOHLCV (event) {
        const asset = this.state.selectedAsset;
        const exchange = this.state.selectedExchange;
        const startDate = this.state.startDate;
        const endDate = this.state.endDate;

        const symbol = await axios.get(`ohlcv/BTC/COINBASE/${startDate}/${endDate}`);

        console.log('sym', symbol);
        // const exchangeRates = await axios.get(`ohlcv/${asset}/USD/${startDate}/${endDate}`);
        //
        // console.log('ex rates are');
        // console.log(exchangeRates);
        //
        // return exchangeRates;
    }

    updateDate (event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    updateSelectedItem (event) {
        const name = 'assets' === event.target.name ? 'selectedAsset' : 'selectedExchange';

        this.setState({
            [name]: event.target.value,
        });
    }

    // lifecycle methods
    async componentDidMount () {
        const lists = await this.getAssetsAndExchanges();

        this.setState({
            availableAssets: lists[0],
            availableExchanges: lists[1],
            selectedAsset: lists[0][0]['asset_id'],
            selectedExchange: lists[1][0]['exchange_id'],
        });
    }

    render () {
        return (
            <AppCon {...this.props}>
                <h1>Welcome to CryptoBot</h1>
                <div>
                    <List
                        name={'assets'}
                        label={'Asset'}
                        selected={this.state.selectedAsset}
                        onChange={this.updateSelectedItem}
                        items={this.state.availableAssets.map(asset => this.assetExchangeMapper(asset, 'asset_id'))} />
                    <List
                        name={'exchanges'}
                        label={'Exchange'}
                        selected={this.state.selectedExchange}
                        onChange={this.updateSelectedItem}
                        items={this.state.availableExchanges.map(exchange => this.assetExchangeMapper(exchange, 'exchange_id'))} />
                    <div>
                        <label>Start Date</label>
                        <input type='date' value={this.state.startDate} name='startDate' onChange={this.updateDate} />
                    </div>
                    <div>
                        <label>End Date</label>
                        <input type='date' value={this.state.endDate} name='endDate' onChange={this.updateDate} />
                    </div>
                    <button type='submit' onClick={this.getOHLCV}>Get Exchange Rates</button>
                </div>
            </AppCon>
        );
    }
};

export default App;