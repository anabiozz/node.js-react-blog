var path = require('path');
var webpack = require('webpack');

var core_url = process.env.CORE_URL ? process.env.CORE_URL : '/';
var SRC_DIR = path.resolve(__dirname, "frontend");
var DIST_DIR = path.resolve(__dirname, "dist");

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-hot-middleware/client',
        'babel-polyfill',
        SRC_DIR + '/index.js'
    ],
    output: {
        path: DIST_DIR,
        filename: 'bundle.js',
        publicPath: core_url+'dist'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                BROWSER: JSON.stringify(true),
                NODE_ENV: JSON.stringify('development'),
                NODE_MODE: JSON.stringify(process.env.NODE_MODE),
                CORE_URL: JSON.stringify(core_url)
            }
        })
    ],
    module: {
        rules: [
            {
              test: /\.jsx?$/, // both .js and .jsx
              loader: 'eslint-loader',
              include: SRC_DIR,
              enforce: 'pre',
              options: {
                fix: true,
              },
            },
            {
                exclude: [/node_modules/],
                include: [
                    SRC_DIR,
                ],
                loader: 'react-hot-loader'
            },
            {
                test: /\.js$/,
                include: [
                    SRC_DIR,
                ],
                loader: 'babel-loader',
                query: {
                    presets: ["react", "es2015", "stage-2"],
                    plugins: ['transform-runtime']
                }
            },
            {
                test:   /\.css$/,
                loader: "style-loader!css-loader!postcss-loader"
            }
        ]
    }
};