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
            assets: [],
            exchanges: [],
            symbols: [],
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
        return await Promise.all([axios.get('assets/get'), axios.get('exchanges/get')])
            .then(result => result.map(result => result.data))
            .catch(error => {
                console.log('Error getting assets and exchages', error);
                return [];
            });
    }

    // event handlers
    async getOHLCV (event) {
        const asset = this.state.selectedAsset;
        const exchange = this.state.selectedExchange;
        const startDate = this.state.startDate;
        const endDate = this.state.endDate;

        // const ohlcv = await axios.get(`ohlcv/${exchange}_SPOT_${asset}_USD/${startDate}/${endDate}`);

        console.log('sym', `${exchange}_SPOT_${asset}_USD`);

        const symbol = this.state.symbols.filter(symbol => symbol.exchange_id === exchange);

        console.log('symbol', symbol);
    }

    updateDate (event) {
        this.setState({[event.target.name]: event.target.value, });
    }

    updateSelectedItem (event) {
        const name = 'assets' === event.target.name ? 'selectedAsset' : 'selectedExchange';

        this.setState({[name]: event.target.value, });
    }

    // lifecycle methods
    async componentDidMount () {
        const lists = await this.getAssetsAndExchanges();

        this.setState({
            assets: lists[0],
            exchanges: lists[1].filter(exchange => 'BINANCE' === exchange.exchange_id || 'COINBASE' === exchange.exchange_id),
            selectedAsset: lists[0][0]['asset_id'],
            selectedExchange: 'COINBASE',
            // selectedExchange: lists[1][0]['exchange_id'],
        }, () => {
            // for rebuilding the symbols table
            axios.get('symbols/drop')
                .then(result => {
                    console.log('result of drop', result);

                    axios.get('symbols/create')
                        .then(result => {
                            console.log('res', result);

                            axios.get('symbols/getDataAndSave')
                                .then(result => {
                                    console.log('res gdas', result);

                                    axios.get('symbols/getAll')
                                        .then(result => {
                                            console.log('symbols get result', result.data.map(res => res.exchange_id + ' ' + res.symbol_id));
                                            console.log(result.data.filter(sym => sym.exchange_id === 'COINBASE'));
                                            this.setState({symbols: result.data});
                                        })
                                        .catch(error => {
                                            console.warn('Error getting symbols', error);
                                        });
                                })
                                .catch(error => console.warn('err gdas', error));
                        })
                        .catch(error => console.warn('err', error));
                })
                .catch(error => console.warn('error dropping table', error));

            // after state is set for user facing data query and set state for symbols, because the request takes more time
            // axios.get('symbols/getAll')
            //     .then(result => {
            //         console.log('symbols get result', result.data.map(res => res.exchange_id + ' ' + res.symbol_id));
            //         console.log(result.data.filter(sym => sym.exchange_id === 'COINBASE'));
            //         this.setState({symbols: result.data});
            //     })
            //     .catch(error => {
            //         console.warn('Error getting symbols', error);
            //     });
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
                        items={this.state.assets.map(asset => this.assetExchangeMapper(asset, 'asset_id'))} />
                    <List
                        name={'exchanges'}
                        label={'Exchange'}
                        selected={this.state.selectedExchange}
                        onChange={this.updateSelectedItem}
                        items={this.state.exchanges.map(exchange => this.assetExchangeMapper(exchange, 'exchange_id'))} />
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