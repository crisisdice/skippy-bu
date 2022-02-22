const path = require('path')

module.exports = {
  mode: 'development',
  target: 'web',
  entry: './src/main.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, './site'),
    //library: 'skippy',       // very important line
    //libraryTarget: 'umd',    // very important line
    //umdNamedDefine: true     // very important line
  },
};
