/*
 * 定义和用户相关的路由处理函数 供 /router/user.js 模块进行调用 
 */


// 导入数据库操作模块
const db = require('../db/index')

// 导入 bcryptjs 包
const bcrypt = require('bcryptjs')

// 导入生成 Token 的包
const jwt = require('jsonwebtoken')

// 导入全局的配置文件
const config = require('../config')

/*
 * 实现步骤
 * 1.检测表单数据是否合法
 * 2.检测用户名是否被占用
 * 3.对密码进行加密处理
 * 4.插入新用户
 */
// 注册用户的处理函数
exports.regUser = (req, res) => {
    // 接收表单数据
    const userinfo = req.body

    // 判断数据是否合法
    if (!userinfo.username || !userinfo.password) {
        return res.send({
            status: 1,
            message: '用户名或者密码不能为空'
        })
    }

    // 定义SQL语句
    const sql = `select * from users where username=?`

    // 执行SQL语句
    db.query(sql, [userinfo.username], function(err, results) {
        // 执行SQL语句失败
        if (err) {
            return res.send({
                status: 1,
                message: err.message
            })
        }

        // 用户名被占用
        if (results.length > 0) {
            return res.send({
                status: 1,
                message: '用户名被占用，请更换其他用户名!'
            })
        }

        // 对密码进行加密处理
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)

        // 定义插入用户的SQL语句
        const sql = 'insert into users set ?'

        // 调用 db.query() 执行SQL语句 插入新用户
        db.query(sql, {
            username: userinfo.username,
            password: userinfo.password
        }, function(err, results) {
            // 执行SQL语句失败
            if (err) {
                return res.send({
                    status: 1,
                    message: err.message
                })
            }

            // 执行SQL语句成功 但影响行数不为 1
            if (results.affectedRows !== 1) {
                return res.send({
                    status: 1,
                    message: '注册用户失败，请稍后再试！'
                })
            }

            res.send({
                status: 0,
                message: '注册成功！'
            })
        })
    })
}

/*
 * 实现步骤
 * 1.检测表单数据是否合法
 * 2.根据用户名查询用户的数据
 * 3.判断用户输入的密码是否正确
 * 4.生成 JWT 的 Token 字符串
 */
// 登录的处理函数
exports.login = (req, res) => {
    // 接收表单数据
    const userinfo = req.body

    // 定义SQL语句
    const sql = `select * from users where username=?`

    // 执行SQL语句 查询用户数据
    db.query(sql, userinfo.username, function(err, results) {
        // 执行SQL语句失败
        if (err) {
            // res.cc() 函数是在全局注册的错误处理中间件
            return res.cc(err)
        }

        // 执行SQL语句成功 但查询到数据条数不等于1
        if (results.length !== 1) {
            return res.cc('登录失败！')
        }

        // 拿着用户输入的密码,和数据库中存储的密码进行对比
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)

        // 如果比对的结果等于false 则证明用户输入的密码错误
        if (!compareResult) {
            return res.cc('登录失败！')
        }

        // 在服务器端生成他 Token 字符串
        // 剔除用户的密码和头像信息
        const user = {...results[0], passwoed: '', user_pic: '' }

        // 对用户的信息进行加密 生成 Token 字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })

        // 调用 res.send() 将 token 响应给客户端
        res.send({
            status: 0,
            message: '登录成功',
            token: 'Bearer ' + tokenStr
        })
    })
}