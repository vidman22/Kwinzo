const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');
const HappyPack = require('happypack');
const webpack = require('webpack');


module.exports = {
  mode: 'development',
  entry: {
      app: ['react-hot-loader/patch',
            './src/index.js',
            'webpack-hot-middleware/client'],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js',
    publicPath: '/'
  },
  module: {
      rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'happypack/loader'
      },
      {
        test:/\.css$/,
        use:['style-loader','css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "index.html"
    }),
    new HappyPack({
      loaders: [ 'babel-loader' ]
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};