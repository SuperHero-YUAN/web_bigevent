// 导入数据库操作模块
const db = require('../db/index')

/**
 * 1.初始化路由模块
 * 2.初始化路由处理函数模块
 * 3.获取文章分类列表数据
 * @param {*} req 
 * @param {*} res 
 */
// 获取文章分类列表数据的处理函数
exports.getArticleCases = (req, res) => {
    // 定义 SQL 语句
    const sql = `select * from article_cate where is_delete=0 order by id asc`

    // 执行SQL语句
    db.query(sql, (err, results) => {
        // 执行SQL语句失败
        if (err) {
            return res.cc(err)
        }

        // 执行SQL语句成功
        res.send({
            status: 0,
            message: '获取文章分类列表成功！',
            data: results
        })
    })
}

/**
 * 1.定义路由和处理函数
 * 2.验证表单数据
 * 3.查询 分类名称 与 分类别名 是否被占用
 * 4.实现新增文章分类的功能 
 * @param {*} req 
 * @param {*} res 
 */
// 添加表单处理函数
exports.addArticleCates = (req, res) => {
    // 定义SQL语句
    const sql = `select * from article_cate where name=? or alias=?`

    // 调用SQL语句
    db.query(sql, [req.body.name, res.body.alias], (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
            return res.cc(err)
        }

        // 判断 分类名称 和 分类别名 是否被占用
        if (results.length === 2) {
            return res.cc('分类名称与别名被占用，请更换后重试！')
        }

        // 分别判断 分类名称 和 分类别名 是否被占用
        if (results.length === 1 && results[0].name === req.body.name) {
            return res.cc('分类名称被占用，请更换后重试！')
        }
        if (results.length === 1 && results[0].alias === req.body.alias) {
            return res.cc('分类别名被占用，请更换后重试！')
        }

        // 新增文章分类
        // 定义SQL语句
        const sql = `insert into article_cate set ?`

        // 调用SQL语句
        db.query(sql, req.body, (err, results) => {
            // 执行SQL语句失败
            if (err) {
                return res.cc(err)
            }

            // SQL 语句执行成功 但是影响行数不等于1
            if (results.affectedRows !== 1) {
                return res.cc('新增文章分类失败！')
            }

            // 新增文章分类成功
            res.cc('新增文章分类成功！', 0)
        })
    })
}

/**
 * 1.定义路由和处理函数
 * 2.验证表单数据
 * 3.实现删除文章分类的功能
 * @param {*} req 
 * @param {*} res 
 */
// 根据id删除对于的文章分类
exports.deleteCateById = (req, res) => {
    // 定义SQL语句
    const sql = `update article_cate set is_delete=1 where id=?`

    // 执行SQL语句
    db.query(sql, req.params.id, (err, results) => {
        // 执行SQL语句失败
        if (err) {
            return res.cc(err)
        }

        // SQL语句执行成功 但是影响行数不等于1
        if (results.affectedRows !== 1) {
            return res.cc('删除文章分类失败！')
        }

        // 删除文章分类成功
        res.cc('删除文章分类成功！', 0)
    })
}

/**
 * 1.定义路由和处理函数
 * 2.验证表单数据
 * 3.实现获取文章分类的功能
 * @param {*} req 
 * @param {*} res 
 */
// 根据 id 获取文章分类数据
exports.getArticleById = (req, res) => {
    // 定义SQL语句
    const sql = `select * from acticle_cate where id=?`

    // 执行SQL语句
    db.query(sql, req.params.id, (err, results) => {
        // 执行SQL失败
        if (err) {
            return res.cc(err)
        }

        // SQL 语句执行成功 但是没有查询到任何数据
        if (results.length !== 1) {
            return res.cc('获取文章分类数据失败！')
        }

        // 把获取的数据响应给客户端
        res.send({
            status: 0,
            message: '获取文章分类数据成功！',
            data: results[0]
        })
    })
}

/**
 * 1.定义路由和处理函数
 * 2.验证表单数据
 * 3.查询 分类名称 与 分类别名 是否被占用
 * 4.实现更新文章分类的功能
 * @param {*} req 
 * @param {*} res 
 */
// 根据id更新文章分类数据
exports.updateCateById = (req, res) => {
    // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    const sql = `select * from article_cate where Id<>? and (name=? or alias=?)`

    //执行查询操作
    db.query(sql, [
        req.body.Id,
        req.body.name,
        req.body.alias
    ], (err, results) => {
        // 执行SQL语句失败
        if (err) {
            return res.cc(err)
        }

        // 判断 分类名称 和 分类别名 是否被占用
        if (results.length === 2) {
            return res.cc('分类名称与类别被占用，请更换后重试！')
        }
        if (results.length === 1 && results[0].name === req.body.name) {
            return res.cc('分类名称被占用，请更换后重试！')
        }
        if (results.length === 1 && results[0].alias === req.body.alias) {
            return res.cc('分类别名被占用，请更换后重试！')
        }

        // 更新文章分类
        // 定义更新文章分类的SQL语句
        const sql = `update article_cate set ? where Id=?`

        // 调用SQL语句
        db.query(sql, [req.body, req.body.Id], (err, results) => {
            // 执行SQL语句失败
            if (err) {
                return res.cc(err)
            }

            // SQL 语句执行成功 但是影响行数不等于1
            if (results.affectedRows !== 1) {
                return res.cc('更新文章分类失败！')
            }

            // 更新文章分类成功
            res.cc('更新文章分类成功！', 0)
        })
    })
}