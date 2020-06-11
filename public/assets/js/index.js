$(function() {
    // 调用 getUserInfo 获取用户的基本信息
    getUserInfo()

    let layer = layui.layer

    // 点击按钮 实现退出
    $('#btnLogout').on('click', function() {
        // 提示用户是否退出
        layer.confirm('确认退出登录吗？', { icon: 3, title: '提示' }, function(index) {
            // 清空本地存储中的 token
            localStorage.removeItem('token')

            // 重新跳转到登录页
            location.href = 'login.html'

            // 关闭 confirm 询问框
            layer.close(index);
        });
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        type: 'get',
        url: '/admin/userinfo',
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }

            // 调用 renderAvatar 函数渲染用户头像
            renderAvatar(res.data)
        }
    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 1、获取用户的名称
    let name = user.nickname || user.username

    // 2、设置欢迎的文本
    $('#welcome').html(`欢迎  ${name}`)

    // 3、按需渲染用户头像
    if (user.user_pic !== null) {
        // 3.1、渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 3.2、渲染文本头像
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}