// 导入数据库操作模块
const db = require('../db/index')

// 在头部区域导入 bcryptjs 后，
// 即可使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
// compareSync() 函数的返回值为布尔值，true 表示密码正确，false 表示密码错误
const bcrypt = require('bcryptjs')

/**
 * 1.初始化 路由 模块
 * 2.初始化 路由处理函数 模块
 * 3.获取用户的基本信息
 * @param {*} req 
 * @param {*} res 
 */
// 获取用户基本信息处理函数
exports.getUserInfo = (req, res) => {
    // 根据用户的id 查询用户的基本信息
    // 注意：为了放置用户密码的泄露 要排除 password 字段
    const sql = `select id,username,nickname,email,user_pic from users where id=?`

    // 注意：req 对象上的 user 属性 是 token 解析成功 express-jwt 中间件挂载上去的
    db.query(sql, req.user.id, (err, results) => {
        // 执行查询语句失败
        if (err) {
            return res.cc(err)
        }

        // 执行 SQL 语句成功 但是查询到的数据条数不等于1
        if (results.length !== 1) res.cc('获取用户信息失败！')

        // 把用户信息响应给客户端
        res.send({
            status: 0,
            message: '获取用户基本信息成功！',
            data: results[0]
        })
    })
}

/**
 * 1.定义路由和处理函数
 * 2.验证表单数据
 * 3.实现更新用户基本信息的功能
 * @param {*} req 
 * @param {*} res 
 */
// 用于更改用户信息
exports.updateUserInfo = (req, res) => {
    // 根据用户的id更改用户的信息
    const sql = `update users set ? where id=?`

    // 调用 db.query
    db.query(sql, [req.body, req.body.id], (err, results) => {
        // 执行SQL语句失败
        if (err) {
            return res.cc(err)
        }

        // 执行SQL语句成功 但是影响行数不为1
        if (results.affectedRows !== 1) {
            return res.cc('修改用户基本信息失败！')
        }

        // 修改用户信息成功
        return res.cc('修改用户基本信息成功！', 0)
    })
}

/**
 * 1.定义路由和处理函数
 * 2.验证表单数据
 * 3.实现重置密码的功能
 * @param {*} req 
 * @param {*} res 
 */
// 重置密码
exports.updatePassword = (req, res) => {
    // 根据 id 查询用户数据的SQL语句
    const sql = `select * from users where id=?`

    // 执行查询语句查看用户是否存在
    db.query(sql, req.user.id, (err, results) => {
        // 执行SQL语句失败
        if (err) {
            return res.cc(err)
        }

        // 检查指定 id 的用户是否存在
        if (results.length !== 1) {
            return res.cc('用户不存在！')
        }

        // 判断提交的旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) {
            return res.cc('原密码错误！')
        }

        // 对新密码进行bcrypt加密后存储到数据库

        // 定义SQL语句
        const sql = `update users set password=? where id=?`

        // 对新密码进行bcrypt加密
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)

        // 执行SQL语句
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            // 执行SQL语句失败
            if (err) {
                return res.cc(err)
            }

            // 执行SQL语句成功 但是影响行数不等于 1
            if (results.affectedRows !== 1) {
                return res.cc('更新密码失败！')
            }

            // 更新密码成功
            res.cc('更新密码成功！', 0)
        })
    })
}

/**
 * 1.定义路由和处理函数
 * 2.验证表单数据
 * 3.实现更新用户头像的功能
 * @param {*} req 
 * @param {*} res 
 */
// 更新用户头像
exports.updateAvatar = (req, res) => {
    // 根据 id 查询用户头像
    const sql = `update users set user_pic=? where id=?`

    // 执行SQL语句
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // 执行SQL语句失败
        if (err) {
            return res.cc(err)
        }

        // 执行SQL语句成功但是影响行数不等于1
        if (results.affectedRows !== 1) {
            return res.cc('更新头像失败！')
        }

        // 更新用户头像成功
        return res.cc('更新头像成功！', 0)
    })
}