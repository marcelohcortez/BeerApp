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
        NODE_ENV: process.env.NODE_ENV || "production",
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
  mode: "production",
  entry: "./src/index.tsx",
  devtool: "source-map",
  module: {
    rules: [
      {
        // Handle tsx files with optimization for production
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.json",
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        // Handle CSS modules with optimized class names for production
        test: /\.module\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[hash:base64:8]", // Shorter class names for production
              },
              sourceMap: false, // Disable source maps for CSS in production
            },
          },
        ],
      },
      {
        // Handle regular CSS files
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /\.module\.css$/,
      },
      {
        // Handle images with hash for cache busting
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: "asset/resource",
        generator: {
          filename: "images/[name].[contenthash:8][ext]",
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
    // Generate optimized HTML file
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      inject: "body",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    // Service worker injection for PWA
    new InjectManifest({
      swSrc: "./src/sw.js",
      swDest: "service-worker.js",
      exclude: [/\.map$/, /manifest$/, /\.htaccess$/],
    }),
    // Environment variables for production
    new webpack.DefinePlugin(env.stringified),
    // Copy static assets
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
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
        mui: {
          test: /[\\/]node_modules[\\/]@mui[\\/]/,
          name: "mui",
          chunks: "all",
          priority: 10,
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: "react",
          chunks: "all",
          priority: 20,
        },
      },
    },
    runtimeChunk: "single",
    usedExports: true, // Enable tree shaking
    sideEffects: false, // Mark the project as side-effect free for better tree shaking
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash:8].js",
    chunkFilename: "[name].[contenthash:8].chunk.js",
    publicPath: "/",
    clean: true,
    assetModuleFilename: "static/[name].[contenthash:8][ext]",
  },
  performance: {
    maxAssetSize: 512000,
    maxEntrypointSize: 512000,
    hints: "warning",
  },
};
