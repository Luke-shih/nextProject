const webpack = require('webpack')
const config = require('./config')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')

const configs = {
  // 編譯文件的輸出目錄
  distDir: 'dest',
  // 是否給每個路由生成Etag
  generateEtags: true,
  // 頁面內容緩存配置
  onDemandEntries: {
    // 內容在內存中緩存的時長（ms）
    maxInactiveAge: 25 * 1000,
    // 同時緩存多少個頁面
    pagesBufferLength: 2,
  },
  // 在pages目錄下那種後綴的文件會被認為是頁面
  pageExtensions: ['jsx', 'js'],
  // 配置buildId
  generateBuildId: async () => {
    if (process.env.YOUR_BUILD_ID) {
      return process.env.YOUR_BUILD_ID
    }

    // 返回null使用默認的unique id
    return null
  },
  // 手動修改webpack config
  webpack(config, options) {
    return config
  },
  // 修改webpackDevMiddleware配置
  webpackDevMiddleware: config => {
    return config
  },
  // 可以在頁面上通過 procsess.env.customKey 獲取 value
  env: {
    customKey: 'value',
  },
  // 下面兩個要通過 'next/config' 來讀取
  // 只有在服務端渲染時才會獲取的配置
  serverRuntimeConfig: {
    mySecret: 'secret',
    secondSecret: process.env.SECOND_SECRET,
  },
  // 獲在服務端渲染和客戶端渲染都可取的配置
  publicRuntimeConfig: {
    staticFolder: '/static',
  },
}

module.exports = withBundleAnalyzer({
  webpack(config) {
    config.plugins.push(new webpack.IgnorePlugin(/^\.\locale$/, /moment$/ ))
    return config
  },
  publicRuntimeConfig: {
    GITHUB_OAUTH_URL: config.GITHUB_OAUTH_URL,
    OAUTH_URL: config.OAUTH_URL,
  },
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzeConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../bundles/server.html'
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html'
    },
  }
})