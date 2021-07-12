const pxtorem = require('postcss-pxtorem');

module.exports = {
  publicPath: '',
  productionSourceMap: false,
  devServer: {
    open: false,
    host: '0.0.0.0',
    port: 8080,
    disableHostCheck: true
  },
  lintOnSave: true,
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          pxtorem({
            rootValue: 100, // 换算的基数
            propList: ['*']
          })
        ]
      }
    }
  }
};
