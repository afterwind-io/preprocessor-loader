/* eslint-disable no-console */
const webpack = require('webpack');

webpack({
    mode: 'none',
    entry: "./mock/mock.js",
    output: {
        filename: "mock.gen.js",
        path: __dirname,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'webpack-preprocessor-loader',
                        options: {
                            debug: false,
                        },
                    },
                ],
            },
        ],
    },
}, (err, stats) => {
    console.log(stats.toString({ colors: true }));
    console.log(err);
});
