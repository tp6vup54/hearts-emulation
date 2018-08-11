module.exports = {
    mode: 'none',
    entry: [
      './src/js/index.js',
    ],
    output: {
      path: `${__dirname}/build`,
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015', 'react'],
          },
        },
      ],
    },
    devServer: {
      inline: true,
      port: 3000,
    },
};
