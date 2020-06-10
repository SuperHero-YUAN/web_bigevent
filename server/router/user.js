const express = require('express')

// 创建路由对象
const router = express.Router()

// 导入用户路由处理函数模块
const userHandle = require('../router_handle/user')

// 注册新用户
router.post('/reguser', userHandle.regUser)

// 登录
router.get('/login', userHandle.login)

// 将路由对象共享出去
module.exports = router