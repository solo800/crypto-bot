import React from 'react';
import Exchange from './Exchange';
import axios from 'axios';

class ExchangeList extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            exchangeList: [],
        };

        this.getExchangeList = this.getExchangeList.bind(this);
    }

    // custom methods
    async getExchangeList () {
        const exchangeList = [];

        await axios.get('/exchange-list/get')
            .then(result => {
                exchangeList.push(...result.data.slice(0, 20));
            })
            .catch(error => {
                console.log('err', error);
            });

        return exchangeList;
    }

    async componentDidMount () {
        const exchangeList = await this.getExchangeList();
        this.setState({exchangeList});
    }

    render () {
        return (
            <div>
                <select>
                    {this.state.exchangeList.map(exchange => <Exchange {...exchange} />)}
                </select>
            </div>
        );
    }
}

export default ExchangeList;