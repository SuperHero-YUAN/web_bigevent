// 注意：每次调用$.ajax() $.get() $.post()的时候 会先调用 ajaxPrefilter 这个函数 在这个函数中 可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起真正的Ajax请求之前 统一凭借基础路径
    options.url = `http://localhost:3008${options.url}`

    if (options.url.indexOf('/admin/') !== -1) {
        // 统一为有权限的接口设置 headers 请求头
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complete 回调函数
    // 无论成功还是失败都会调用 complete 函数
    options.complete = function(res) {
        // 在 complete 回调函数中 我们可以使用 res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空 token
            localStorage.removeItem('token')

            // 强制跳转到登录页面
            location.href = 'login.html'
        }
    }
})