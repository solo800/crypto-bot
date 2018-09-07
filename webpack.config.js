const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    target: 'node',
    mode: 'production',
    entry: {
        main: ['babel-polyfill', './src/index.js'],
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [{ loader: 'html-loader', options: { minimize: true } }],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: 'src/index.html',
            filename: './index.html',
        }),
    ],
};