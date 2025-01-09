const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: "development",
    entry: "./src/index",
    devServer: {
        static: './src'
    },
    output: {
        path: path.resolve(__dirname, "./docs"),
        filename: "bundle.js"
    },
    resolve: {
        extensions: [".ts", ".js", ".cjs", ".json"],
        alias: {
            '@': path.join(__dirname, 'src'),
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
            },
            {
                test: /\.scss$/,  // 匹配 SCSS 檔案
                use: [
                    'style-loader',  // 把 CSS 加入到 DOM 中
                    'css-loader',    // 解析 CSS
                    'sass-loader'    // 解析 SCSS
                ],
            },
            {
                test: /\.ts/,
                loader: "ts-loader"
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html'
        })
    ]
}
