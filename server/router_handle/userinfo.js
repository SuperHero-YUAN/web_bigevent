// 导入数据库操作模块
const db = require('../db/index')

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