const glob = require('glob');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: glob.sync('./src/modules/**/*.js').reduce((acc, file) => {
        const entryName = path.basename(file, '.js'); // Extract file name without extension
        acc[entryName] = `./${file}`;
        return acc;
    }, {}),
    mode: 'production',
    output: {
        filename: 'milos-[name].js', // Updated filename option
        path: path.resolve(__dirname, 'assets'),
    },
    optimization: {
        minimizer: [new TerserPlugin()],
        minimize: true,
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                }
            }
        ]
    },
};
