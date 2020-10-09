module.exports = {
  devServer: {
    open: true,
    port: 8081,
    hotOnly: false,
    proxy: {
      "/api": {
          target: "http://127.0.0.1:8089/api",
          changeOrigin: true,
          pathRewrite: { 
            "^/api": ""
          }
      }
    }
  }
}
