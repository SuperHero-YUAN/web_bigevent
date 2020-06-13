// 导入 express 框架
const express = require('express')

// 搭建 web 服务器
const app = express()

// 导入并配置 cors 中间件 支持跨域访问
const cors = require('cors')
app.use(cors())

const joi = require('@hapi/joi')

// 配置解析表单数据的中间件,注意：这个中间件只能解析 applocation/x-www-form-urlencoded 格式的表单
app.use(express.urlencoded({ extended: false }))

// 优化 res.send() 代码
// 在 app.js 中，所有路由之前，声明一个全局中间件，为 res 对象挂载一个 res.cc() 函数 ：
app.use(function(req, res, next) {
    // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
    res.cc = function(err, status = 1) {
        res.send({
            // 状态
            status,
            // 状态描述，判断 err 是 错误对象 还是 字符串
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

// 一定要在路由之前配置解析 Token 的中间件
const expressJWT = require('express-jwt')
const config = require('./config')

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))

app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] }))

// 导入并注册新用户路由模块
app.use('/api', require('./router/user'))

// 导入并使用用户信息路由模块
app.use('/home', require('./router/userinfo'))

// 导入并使用文章分类路由模块
// 为文章分类的路由挂载统一的访问前缀 /home/article
app.use('/home/article', require('./router/artcate'))

// 导入并使用文章路由模块
// 为文章的路由挂载统一的访问前缀 /home/article
app.use('/home/article', require('./router/article'))

// 错误处理中间件
app.use(function(err, req, res, next) {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)

    // 验证身份失败
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')

    // 未知错误
    res.cc(err)
})

// 监听端口
app.listen(3008, () => {
    console.log('api server running at http://localhost:3008')
})