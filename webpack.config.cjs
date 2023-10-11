const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const isProduction = process.env.NODE_ENV == "production";

const config = {

  entry: path.resolve(__dirname, 'src/time-machine-masonry.ts'),

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, "dist"),
    // publicPath: '/dist/',
  },

  devtool: 'inline-source-map',

  devServer: {
    // open: true,
    static: {
        directory: path.resolve(__dirname, 'dist'),
        serveIndex: true,
    },
    hot: true,
    port: 8000,
    host: 'localhost',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: ['localhost'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],

  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
