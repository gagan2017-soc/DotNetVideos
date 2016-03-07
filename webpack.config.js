// @datatype_void

var webpack = require('webpack');
var helpers = require('./helpers');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var ENV = process.env.ENV = process.env.NODE_ENV = 'development';
var HMR = helpers.hasProcessFlag('hot');

var config = require('./config/config.json');

var metadata = {
  title: 'Angular 2 MEAN Webpack Starter Kit by @datatype_void',
  baseUrl: '/',
  host: 'localhost',
  port: 8080,
  ENV: ENV,
  HMR: HMR
};
/*
 * Config
 */
module.exports = helpers.defaults({
  // static data for index.html
  metadata: metadata,
  // devtool: 'eval' // for faster builds use 'eval'

  // our angular app
  entry: {
    'polyfills': './src/polyfills.ts',
    'main': './src/main.ts'
  },

  // Config for our build files
  output: {
    path: helpers.root('dist')
  },


  resolve: {
    extensions: ['', '.ts', '.async.ts', '.js']
  },

  module: {
    preLoaders: [
      // { test: /\.ts$/, loader: 'tslint-loader', exclude: [ helpers.root('node_modules') ] },
      // TODO(datatypevoid):
      //`exclude: [ helpers.root('node_modules/rxjs') ]`
      //fixed with rxjs 5 beta.3 release
      { test: /\.js$/, loader: "source-map-loader",
        exclude: [ helpers.root('node_modules/rxjs') ]
      }
    ],
    loaders: [
      // Support for .ts files.
      { test: /\.ts$/, loader: 'ts-loader', exclude: [ /\.(spec|e2e)\.ts$/ ] },

      // Support for *.json files.
      { test: /\.json$/,  loader: 'json-loader' },

      // Support for CSS as raw text
      { test: /\.css$/,   loader: 'raw-loader' },

      // support for .html as raw text
      { test: /\.html$/,
        loader: 'raw-loader',
        exclude: [ helpers.root('src/index.html') ]
      },

      // support for sass imports
      // add CSS rules to your document:
      // `require("!style!css!sass!./file.scss");`
      {
        test: /\.scss$/,
        loader: 'style!css!autoprefixer-loader?browsers=last 2 versions!sass'
      }

      // if you add a loader include the resolve file extension above
    ]
  },

  plugins: [
    // TODO(datatypevoid): investigate the necessity of these two
    // following lines
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),

    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.CommonsChunkPlugin({ name: 'polyfills', filename: 'polyfills.bundle.js', minChunks: Infinity }),
    // static assets
    new CopyWebpackPlugin([ { from: 'src/assets', to: 'assets' } ]),
    // generating html
    new HtmlWebpackPlugin({ template: 'src/index.html' }),
    // replace
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(metadata.ENV),
        'NODE_ENV': JSON.stringify(metadata.ENV),
        'HMR': HMR
      }
    })
  ],

  // Other module loader config

  // our Webpack Development Server config
  devServer: {
    // Proxy requests to our express server
    proxy: {
      '*': {
        target: 'http://localhost:' + config.PORT,
        secure: false
      },
    },
    port: metadata.port,
    host: metadata.host
  }
});