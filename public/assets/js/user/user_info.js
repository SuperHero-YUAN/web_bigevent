$(function() {
    let form = layui.form,
        layer = layui.layer

    form.verify({
        // 定义用户名的校验规则
        nickname: function(value) {
            if (value.length > 18) {
                return '名称长度必须在 1 - 18 个字符之间'
            }
        }
    })

    // 获取用户的基本信息
    initUserinfo()

    // 初始化用户的基本信息
    function initUserinfo() {
        $.ajax({
            type: 'get',
            url: '/home/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }

                // 掉用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data)

                // 把登录名称单独渲染到表单
                $('.layui-form [placeholder="请输入登录名称"]').val(res.data.username)
            }
        })
    }

    // 重置表单的数据
    $('#btnReset').on('click', function(e) {
        // 重新获取用户基本信息
        initUserinfo()

        // 阻止表单的默认重置事件 把表单项清空
        return false
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function() {
        // 获取用户在表单中输入的数据
        let formdata = $(this).serialize()

        // 发起请求 修改用户基本信息
        $.ajax({
            type: 'post',
            url: '/home/userinfo',
            data: formdata,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }

                layer.msg('更新用户信息成功')

                // 重新获取用户基本信息
                initUserinfo()

                // 刷新父页面
                // 调用父页面的方法 重新渲染父页面的头像个用户信息
                window.parent.getUserInfo()
            }
        })

        // 阻止表单的默认提交事件
        return false
    })
})