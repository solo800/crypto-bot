import React from 'react';
import axios from 'axios';
import Asset from './Asset';

class AssetList extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            assetList: [],
        };

        // aws dynamoDB local startup cd ~/dynamodb_local_latest && java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb

        this.getAssetList = this.getAssetList.bind(this);
    }

    // custom methods
    async getAssetList (symbol = 'BTC', market = 'USD') {
        const assetList = [];

        await axios.get('asset-list/get')
            .then(result => {
                assetList.push(...result.data.slice(0, 20));
            })
            .catch(error => {
                console.log('error getting currency list', error);
            });

        return assetList;
    }

    // lifecycle methods
    async componentDidMount () {
        const assetList = await this.getAssetList();

        this.setState({assetList});
    }

    render () {
        return (
            <div>
                <select>
                    {this.state.assetList.map(asset => <Asset {...asset} />)}
                </select>
            </div>
        );
    }
}

export default AssetList;