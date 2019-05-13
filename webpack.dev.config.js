const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const outputDirectory = "dist";


module.exports = {
  entry: ['babel-polyfill', './client/index.jsx'],
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: "bundle.js"
  },
  mode: 'development',
  module: {
    rules: [{
        use: [{
          loader: 'babel-loader',
          options: {
            plugins: ['transform-object-rest-spread']
          }
        }],
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|jpeg|ico)$/,
        use: [{
          loader: 'file-loader',
          options: {}
        }]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  // devServer: {
  //   port: 3000,
  //   open: true,
  //   proxy: {
  //     "/api": "http://localhost:8080"
  //   }
  // },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./client/index.html",
      // favicon: "./client/assets/favicons/favicon.ico"
    })
  ]
};
