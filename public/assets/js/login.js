$(function() {
    // 点击"去注册账号"的连接
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击"去登陆"的连接
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从 layui 中获取 form 对象
    let form = layui.form

    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 定义了一个叫做 password 的校验规则
        password: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一至
        repassword: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框的内容
            // 然后进行一次等于判断
            // 如果判断失败 则 return 一个错误提示消息

            let password = $('.reg-box [name=password]').val()
            if (password !== value) {
                return '两次密码输入不一致'
            }
        }
    })

    // 导入 layer
    let layer = layui.layer

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        // 阻止表单的默认提交事件
        e.preventDefault()

        // 获取用户在表单中输入的数据
        let formData = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }

        console.log(formData)

        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: formData,
            success: function(res) {
                if (res.status == 1) {
                    return layer.msg(res.message, { icon: 2 })
                }

                layer.msg('注册成功，请登录！', {
                    icon: 1,
                    time: 2000 //2秒关闭
                }, function() {
                    // 手动调用点击事件 跳转到登录窗口
                    $('#link_login').click()
                });
            }
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').on('submit', function(e) {
        // 阻止默认提交行为
        e.preventDefault()

        // 获取用户在登录表单中输入的内容
        let formData = $(this).serialize()

        $.ajax({
            type: 'post',
            url: '/api/login',
            data: formData,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message, { icon: 2 })
                }

                layer.msg('登录成功！', {
                    icon: 1
                }, function() {
                    // 登录成功将得到的 token 字符串 保存到 localStorage 中
                    localStorage.setItem('token', res.token)

                    // 跳转到管理员首页
                    location.href = 'index.html'
                });
            }
        })
    })
})