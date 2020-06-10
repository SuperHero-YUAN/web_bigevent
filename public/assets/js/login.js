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
})