const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist')
};

const isPROD = process.env.NODE_ENV === 'prod';

const htmlMinifyOptions = {
  collapseWhitespace: true,
  html5: true,
  minifyCSS: true,
  removeComments: true,
  removeEmptyAttributes: true
};

module.exports = {
  entry: `${PATHS.src}/index.js`,
  output: {
    path: PATHS.dist,
    filename: 'bundle.[hash].min.js'
  },
  devtool: isPROD ? 'none' : 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [require('@babel/plugin-proposal-object-rest-spread')]
          }
        }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: isPROD
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  autoprefixer({
                    browsers: ['ie > 9', 'last 3 version']
                  })
                ],
                sourceMap: isPROD
              }
            },
            'sass-loader'
          ]
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader']
        }),
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8000,
            name: 'assets/[name].[ext]'
          }
        }]
      },
      {
        test: /\.(woff|ttf|otf|eot|woff2)$/i,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.(html)$/,
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'dev')
    }),
    new ExtractTextPlugin('[name].[hash].min.css'),
    new HtmlWebpackPlugin({
      template: `${PATHS.src}/index.html`,
      minify: isPROD ? htmlMinifyOptions : false
    }),
    new CleanWebpackPlugin(['dist'])
  ],
  devServer: {
    port: 4200,
    stats: 'errors-only'
  }
}