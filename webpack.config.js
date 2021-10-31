const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')


module.exports = {
    //* Elemento de entrada esto es lo primero 
    entry: './src/index.js',
    //* Elemento de salida en donde va a quedar compilado el proyecto
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        assetModuleFilename: 'assets/images/[hash][ext][query]'
    },
    resolve: {
        // se establece los archivos con los que trabajara
        extensions: ['.js'],
        alias: {
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@templates': path.resolve(__dirname, 'src/templates'),
            '@styles': path.resolve(__dirname, 'src/styles'),
            '@images': path.resolve(__dirname, 'src/assets/images'),
        }
    },
    mode:'production',
    module: {
        rules: [
            {
                // Test declara que extensión de archivos aplicara el loader
                test: /\.m?js$/,
                // Use es un arreglo u objeto donde dices que loader aplicaras
                use: {
                    loader: "babel-loader"
                },
                // Exclude permite omitir archivos o carpetas especificas
                exclude: /node_modules/
            },
            {
                test: /\.css|styl$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'stylus-loader'
                ],
            },
            {
                test: /\.png/,
                type:'asset/resource'
            },
            {
                test: /\.(woff|woff2)$/,
                use: {
                  loader: 'url-loader',
                  options: {
                    limit: 10000,
                    mimetype: "application/font-woff",
                    name: "[name].[contenthash].[ext]",
                    outputPath: "./assets/fonts/",
                    publicPath: "../assets/fonts/",
                    esModule: false,
                  },
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: './public/index.html',
            filename:'./index.html'
        }),
        new MiniCssExtractPlugin({
            filename:'assets/[name].[contenthash].css'
        }),
        new Dotenv(),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src', 'assets/images'),
                    to:'assets/images'
                }
            ]
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin()
        ]
    }
}