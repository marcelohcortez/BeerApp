const { InjectManifest } = require('workbox-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        // tell webpack how to handle tsx files
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        // tell webpack how to handle module.css files
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              url: true, // enable transformation of url() paths
            },
          },
        ],
      },
      {
        // tell webpack how to handle css files
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /\.module\.css$/,
      },
      {
        // tell webpack how to handle img files
        test: /\.(png|jpg|jpeg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    // help webpack handle the index.html file
    new HtmlWebpackPlugin({
      template: './public/index.html',
      publicPath: '/',
    }),
    // where service worker is injected and where should be outputed
    new InjectManifest({
      swSrc: './src/sw.js',
      swDest: 'service-worker.js',
    }),
    // avoid "process is not defined" error
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    // automatically copy files from public to dist folder, but ignore index.html
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '.', globOptions: { ignore: ['**/index.html'] } },
      ],
    }),
  ],
};