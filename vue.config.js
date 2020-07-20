const path = require('path')
const fs = require('fs')
const mockPath = path.resolve(__dirname, './mock')
const isMock = process.VUE_CLI_SERVICE.mode === 'mock'
function mockProxy (app, mockDirPath) {
  fs.readdirSync(mockDirPath).forEach(function (file) {
    if (file !== 'utils.js' && !file.endsWith('.json')) {
      const filePath = path.resolve(mockDirPath, file)
      if (fs.statSync(filePath).isDirectory()) {
        mockProxy(app, filePath)
      } else {
        const mock = require(filePath)
        // 请求转发，可跨域
        app.use(mock.api, (req, res) => { mock.response(req, res) })
      }
    }
  })
}

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
const configProxy = 'http://localhost:8080/'
module.exports = {
  lintOnSave: !IS_PROD,
  publicPath: IS_PROD ? '/ems' : '/',
  productionSourceMap: !IS_PROD,
  runtimeCompiler: true,
  devServer: {
    open: true,
    port: 9000,
    before: function (app) {
      if (isMock) {
        mockProxy(app, mockPath)
      }
    },
    proxy: IS_PROD ? '' : configProxy,
    overlay: {
      warnings: true,
      errors: true
    }
  }
}
