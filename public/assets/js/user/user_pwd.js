$(function() {
    let form = layui.form
    let layer = layui.layer

    form.verify({
        pwd: [
            /^[\S]{6,18}$/, '密码必须6到18位，且不能出现空格'
        ],
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次输入密码不一致，请重新输入'
            }
        }
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function() {

        // 发送请求 修改密码
        $.ajax({
            type: 'post',
            url: '/home/updatepwd',
            data: {
                oldPwd: $('.layui-form [name=oldPwd]').val(),
                newPwd: $('.layui-form [name=newPwd]').val()
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败')
                }

                layer.msg('密码修改成功！')

                // 重置表单
                $('.layui-form')[0].reset()
            }
        })

        // 阻止表单的默认提交事件
        return false
    })
})