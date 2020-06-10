// 导入 express 框架
const express = require('express')


// 搭建 web 服务器
const app = express()


// 导入并配置 cors 中间件 支持跨域访问
const cors = require('cors')
app.use(cors())

// 配置解析表单数据的中间件,注意：这个中间件只能解析 applocation/x-www-form-urlencoded 格式的表单
app.use(express.urlencoded({ extended: false }))

// 导入并注册新用户路由模块
app.use('/api', require('./router/user'))

// 监听端口
app.listen(3008, () => {
    console.log('api server running at http://localhost:3008')
})