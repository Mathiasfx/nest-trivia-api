const path = require('path');

module.exports = {
  target: 'node',
  mode: process.env.NODE_ENV || 'production',
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    clean: true,
  },
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
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
  devtool: 'source-map',
  externals: {
    // Exclude node modules from bundling
    '@nestjs/common': '@nestjs/common',
    '@nestjs/core': '@nestjs/core',
    '@nestjs/websockets': '@nestjs/websockets',
    '@nestjs/platform-socket.io': '@nestjs/platform-socket.io',
    '@nestjs/jwt': '@nestjs/jwt',
    '@nestjs/passport': '@nestjs/passport',
    '@prisma/client': '@prisma/client',
    passport: 'passport',
    'passport-jwt': 'passport-jwt',
    'socket.io': 'socket.io',
    rxjs: 'rxjs',
  },
};
