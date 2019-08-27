const path = require('path');
const webpack = require('webpack');
const moment = require('moment');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');

const packageJson = require('../package.json');

const resolve = path.resolve;

module.exports = {
  target: 'node',
  context: resolve('src'),
  entry: './module.tsx',
  output: {
    filename: 'module.js',
    path: resolve('dist'),
    libraryTarget: 'amd'
  },
  externals: [
    // remove the line below if you don't want to use buildin versions
    'jquery', 'lodash', 'moment', 'react', 'react-dom',
    '@grafana/ui', '@grafana/data', '@grafana/runtime',
    function (context, request, callback) {
      var prefix = 'grafana/';
      if (request.indexOf(prefix) === 0) {
        return callback(null, request.substr(prefix.length));
      }
      callback();
    }
  ],
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new CopyWebpackPlugin([
      { from: '../README.md' },
      { from: 'plugin.json' }
    ]),
    new ReplaceInFileWebpackPlugin([{
      dir: 'dist',
      files: ['plugin.json'],
      rules: [{
        search: '%VERSION%',
        replace: packageJson.version
      }, {
        search: '%TODAY%',
        replace: moment().format('YYYY.MM.DD')
      }]
    }])
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      'src': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
}
