module.exports = {
    publicPath: '/',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        host:'127.0.0.1',
        port:8085,  // 端口号的配置
        open:true , // 自动打开浏览器
        // 前端跨域配置
        proxy: {
            '/api':{
                target:'http://localhost:8055',
                ws:true,
                changeOrigin:true,
                pathRewrite:{
                    '^/api':''
                }
            }
        }
    }
}