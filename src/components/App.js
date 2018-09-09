import React from 'react';
import AppCon from './styles';
import CurrencyList from './Assets/AssetList';
import ExchangeList from './Exchanges/ExchangeList';

const App = props => {
    return (
        <AppCon {...props}>
            <h1>Welcome to CryptoBot</h1>
            <CurrencyList />
            <ExchangeList />
        </AppCon>
    );
};

export default App;