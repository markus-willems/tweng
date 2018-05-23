const path = require('path');
const os = require('os');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = () => {
    return {
        entry: ['whatwg-fetch', 'babel-polyfill', './src/index.js'],
        output: {
            filename: 'bundle.[chunkHash].js',
            path: path.resolve(__dirname, 'build'),
        },
        resolve: {
            extensions: ['.js', '.json', '.jsx'],
        },
        devServer: {
            port: 1234,
            host: '0.0.0.0',
            allowedHosts: [os.hostname()],
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /\.(jpg|svg)$/,
                    use: {
                        loader: 'file-loader',
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: 'style-loader',
                        },
                        {
                            loader: 'css-loader',
                        },
                    ],
                },
            ],
        },
        plugins: [
            new Dotenv(),
            new HtmlWebpackPlugin({
                template: './src/index.html',
            }),
        ],
    };
};
