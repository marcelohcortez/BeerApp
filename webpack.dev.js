const { InjectManifest } = require("workbox-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

// Load environment variables if dotenv is available
try {
  require("dotenv").config();
} catch (e) {
  // dotenv not installed, use process.env directly
  console.log("dotenv not found, using process.env directly");
}

// Get REACT_APP_ environment variables
const getClientEnvironment = () => {
  const raw = Object.keys(process.env)
    .filter((key) => key.startsWith("REACT_APP_"))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        NODE_ENV: process.env.NODE_ENV || "development",
        // Fallback for REACT_APP_API if not set
        REACT_APP_API:
          process.env.REACT_APP_API || "https://api.openbrewerydb.org/v1/",
      }
    );

  // Stringify all values so we can feed into webpack.DefinePlugin
  const stringified = {
    "process.env": Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
};

const env = getClientEnvironment();

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  devtool: "eval-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true,
    compress: true,
  },
  module: {
    rules: [
      {
        // Handle tsx files
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true, // Faster builds in dev
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        // Handle CSS modules
        test: /\.module\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]--[hash:base64:5]", // Better debugging in dev
              },
              sourceMap: true,
            },
          },
        ],
      },
      {
        // Handle regular CSS files
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
        exclude: /\.module\.css$/,
      },
      {
        // Handle images
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: "asset/resource",
        generator: {
          filename: "images/[name][ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      inject: "body",
    }),
    new webpack.DefinePlugin(env.stringified),
    new webpack.HotModuleReplacementPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: "public",
          to: ".",
          globOptions: {
            ignore: ["**/index.html"],
          },
        },
      ],
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    publicPath: "/",
    clean: true,
  },
};
