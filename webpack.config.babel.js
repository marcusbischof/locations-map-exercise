import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const LAUNCH_COMMAND = process.env.npm_lifecycle_event;
const isProduction = LAUNCH_COMMAND === 'build';

const STATIC_URL = isProduction
  ? '/static/webpack/locations-map-exercise/'
  : '';

process.env.BABEL_ENV = LAUNCH_COMMAND;

const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist')
};

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.join(__dirname, '/src/index.html'),
  filename: 'index.html',
  inject: 'body'
});

const productionPlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production')
  }
});

const base = {
  entry: './src/index.js',
  output: {
    filename: 'checkout-exercise.js',
    path: PATHS.dist,
    publicPath: STATIC_URL
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.js']
  }
};

const developmentConfig = {
  devtool: 'cheap-module-inline-source-map',
  devServer: {
    contentBase: PATHS.dist,
    hot: true,
    inline: true
  },
  plugins: [HtmlWebpackPluginConfig, new webpack.HotModuleReplacementPlugin()]
};

const productionConfig = {
  devtool: 'source-map',
  plugins: [HtmlWebpackPluginConfig, productionPlugin]
};

export default Object.assign(
  {},
  base,
  isProduction ? productionConfig : developmentConfig
);
