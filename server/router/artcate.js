// 导入 express 
const express = require('express')

// 创建路由对象
const router = express.Router()

// 导入文章分类的路由处理函数模块
const article_handler = require('../router_handle/artcate')

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')

// 导入文章分类验证模块
const {
    add_cate_schema,
    delete_cate_schema,
    get_cate_schema,
    update_cate_schema
} = require('../schema/aetcate')

// 获取文章分类数据列表
router.get('/cates', article_handler.getArticleCases)

// 新增文章分类
router.post('/addcates', expressJoi(add_cate_schema), article_handler.addArticleCates)

// 根据id删除文章
router.get('/deltetcate/:id', expressJoi(delete_cate_schema), article_handler.deleteCateById)

// 根据id获取文章分类数据
router.get('/cates/:id', expressJoi(get_cate_schema), article_handler.getArticleById)

// 根据id更新文章分类数据
router.post('/updatecate', expressJoi(update_cate_schema), article_handler.updateCateById)

// 向外共享路由对象
module.exports = router