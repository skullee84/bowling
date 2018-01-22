const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Webpack2Polyfill = require("webpack2-polyfill-plugin");

const pkg = require('./package.json');
const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'app'),
  dist: path.join(__dirname, 'dist'),
  style: path.join(__dirname, 'app/css/style.css')
};

const common = {
  entry: {
    index: path.join(PATHS.app, 'index.jsx'),
    style: PATHS.style
  },
  resolve: {
    modules: [
      PATHS.app,
      'node_modules'
    ],
    alias: {
      libs: path.resolve(__dirname, 'app/libs/'),
      constants: path.resolve(__dirname, 'app/constants/'),
      actions: path.resolve(__dirname, 'app/actions/'),
      apis: path.resolve(__dirname, 'app/apis/'),
      stores: path.resolve(__dirname, 'app/stores/')
    },
    extensions: ['.js', '.jsx']
  },
  resolveLoader: {
    moduleExtensions: ["-loader"]
  },
  output: {
    path: PATHS.dist,
    filename: '[name].js'
  },
  module: {
    noParse: /node_modules\/quill\/dist/,
    rules: [
      {
        test: /\.jpe?g$|\.gif$|\.png$/,
        loader: 'file'
      },
      {
        test: /\.(otf|eot|svg|ttf|woff)/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.app
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      filename: 'index.html',
      template: 'app/templates/template.ejs'
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "Tether": 'tether'
    }),
    new Webpack2Polyfill()
  ]
};

if(TARGET === 'build' || !TARGET) {
  module.exports = merge(common, {
    entry: {
      vendor: Object.keys(pkg.dependencies).filter(function(v) {
        return v !== 'font-awesome' && v !== 'tether' && v !== 'bootstrap';
      })
    },
    output: {
      path: PATHS.dist,
      filename: '[name].[hash].js',
      chunkFilename: '[hash].js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
            use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: "css-loader"
          })
        }
      ]
    },
    plugins: [
      new CleanPlugin(
        [PATHS.dist]
      ),
      new ExtractTextPlugin({
        filename: '[name].[hash].css',
        allChunks: true,
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor-[hash].min.js'
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true
      })
    ]
  });
}

if(TARGET === 'start') {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    module: {
      rules: [
        {
          test: /\.css$/,
          loaders: ['style', 'css']
        }
      ]
    }
  });
}

if(TARGET === 'develop') {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      contentBase: PATHS.dist,
      compress: true,
      historyApiFallback: true,
      hot: true,
      https: false,
      inline: true,
      stats: 'errors-only',
      overlay: {
        warnings: true,
        errors: true
      },
      watchContentBase: true,
      watchOptions: {
        poll: true
      },
      host: process.env.HOST,
      port: process.env.PORT || 7070
    },
    output: {
      publicPath: 'http://localhost:7070/'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          loaders: ['style', 'css']
        }
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}
