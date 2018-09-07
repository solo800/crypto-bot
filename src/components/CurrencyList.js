import React from 'react';
import axios from 'axios';
// import assetsList from '../assets';
import Currency from './Currency';

class CurrencyList extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            assetsList: [],
        };

        // aws dynamoDB local startup cd ~/dynamodb_local_latest && java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb

        // this.get = this.get.bind(this);
        // this.setSelectedCurrency = this.setSelectedCurrency.bind(this);
        this.getCurrencyList = this.getCurrencyList.bind(this);
    }

    // custom methods
    async getCurrencyList (symbol = 'BTC', market = 'USD') {
        // await axios(`${this.alphaVantage.root}${this.alphaVantage.apiKey}&${this.alphaVantage.function}&market=USD&symbol=BTC`)

        const assetsList = [];
        await axios.get('assets-list')
            .then(res => {
                console.log('res of assets-list', res);
                // assetsList.push(...res.data)
            })
            .catch(err => {
                console.log('error', err);
            });

        return assetsList;
    }

    // lifecycle methods
    async componentDidMount () {
        const a = await this.getCurrencyList();

        console.log('a', a);
    }

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