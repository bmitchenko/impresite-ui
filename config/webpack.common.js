var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.ts'
  },

  resolve: {
    extensions: ['', '.js', '.ts']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: ['ts', 'angular2-template-loader']
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      // {
      //   test:
      //   /\.png$/,
      //   loader: "url-loader?mimetype=image/png"
      // },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file?name=assets/[name].[hash].[ext]'
      },
      {
   test: /\.component\.scss$/,
   include: helpers.root('src'),
   loaders: ['exports-loader?module.exports.toString()', 'css', 'sass']
},
      {
   test: /\.dialog\.scss$/,
   include: helpers.root('src'),
   loaders: ['exports-loader?module.exports.toString()', 'css', 'sass']
},
      {
        test: /^(?!.*component).*\.scss$/,
        include: helpers.root('src'),
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap!resolve-url!sass?sourceMap')
      },
      // {
      //     test: /\.component\.scss$/, loaders: ['exports-loader?module.exports.toString()', 'css', 'sass']  
      //   //test: /\.scss$/,
      //   //loader: 'raw!css?sourceMap!resolve-url!sass?sourceMap'
      // },

      //{ test: /^(?!.*component).*\.scss$/, loaders: ['style', 'css', 'resolve-url', 'sass'] },
      //{ test: /\.component\.scss$/, loaders: ['raw', 'resolve-url', 'sass'] },
      //      {
      //        test: /\.component\.scss$/,
      //        //exclude: helpers.root('src', 'app'),
      //        loader: ExtractTextPlugin.extract('style', 'css?sourceMap!resolve-url!sass?sourceMap')
      //      },
      //      {
      //        test: /^(?!.*component).*\.scss$/,
      //        //include: helpers.root('src', 'app'),
      //        loaders: ['exports-loader?module.exports.toString()', 'css', 'sass']
      //      },
      // {
      //   test: /\.scss$/,
      //   exclude: helpers.root('src', 'app'),
      //   loader: ExtractTextPlugin.extract('style', 'css?sourceMap!resolve-url!sass?sourceMap')
      // },
      // {
      //   test: /\.scss$/,
      //   include: helpers.root('src', 'app'),
      //   loaders: ['exports-loader?module.exports.toString()', 'css', 'sass']
      // },
      // {
      //   test: /\.less$/,
      //   exclude: /node_modules/,
      //   loader: 'raw!less'
      // },
      {
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loader: 'raw'
      }
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),

    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
};