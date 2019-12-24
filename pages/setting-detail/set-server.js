// pages/setting-detail/set-serer.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // radioItems: [
        //   { name: '服务器1：210.30.62.37', value: '210.30.62.37', state:"",checked: true },
        //   { name: '服务器2：210.30.62.38', value: '210.30.62.38', state: "" },
        //   { name: '服务器3：210.30.62.39', value: '210.30.62.39', state: "" },
        //   { name: '服务器4：210.30.62.40', value: '210.30.62.40', state: "" }
        // ],
        redioItems: []
    },
    radioChange: function(e) {
        var that = this;
        console.log('radio发生change事件，携带value值为：', e.detail.value);
        var radioItems = this.data.radioItems;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == e.detail.value;
        }
        this.setData({
            radioItems: radioItems
        });
        wx.setStorageSync("myserver", e.detail.value);
        // wx.setStorage({
        //   key: 'server',
        //   data: e.detail.value,
        // });
        console.log("存server:" + e.detail.value);
        wx.showToast({
            title: '更换成功！',
            duration: 1000
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        //主题更新
        that.setData({
            theme: app.getTheme()
        });
        wx.showLoading({
            title: '加载中...',
        })
        wx.request({
            url: 'https://test.1zdz.cn/api/getserver.php',
            method: 'GET',
            success: function(res) {
                wx.hideLoading();
                console.log(res);
                let myserver = wx.getStorageSync("myserver");
                console.log(myserver);
                // wx.setStorageSync("myserver", res.data.server);
                // wx.setStorageSync("myserverindex", res.data.index);
                let servers = new Array();
                for (let i = 0; i < res.data.all.length; i++) {
                    let sitem = new Object();
                    sitem['name'] = res.data.all[i].name;
                    sitem['value'] = res.data.all[i].server;
                    sitem['state'] = res.data.all[i].state;
                    myserver == res.data.all[i].server ? sitem['checked'] = true : sitem['checked'] = false;
                    servers[i] = sitem;
                }
                that.setData({
                    radioItems: servers
                });
            }
        })
        wx.hideLoading();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this;
        //主题更新
        that.setData({
            theme: app.getTheme()
        });
    },
    // 检测当前服务器
    checkServer: function() {
        var that = this;
        var userid = wx.getStorageSync("userid");
        var userpwd = wx.getStorageSync("userpwd");
        userpwd = encodeURIComponent(userpwd); //转义，防止有特殊字符如：&
        //0 验证失败， 1密码正确， 2密码错误， 3服务器被ban
        app.checkUser(userid, userpwd).then(res => {
            console.log(res);
            if (res.data.code == 200) {
                if (res.data.name) { //密码正确
                    wx.showModal({
                        title: '恭喜「 ' + res.data.name +' 」同学',
                        showCancel: false,
                        content: '当前服务器正常可用！',
                        confirmColor: that.data.theme.color[that.data.theme.themeColorId].value
                    })
                } // end of 密码正确
                else {  //  密码错误
                    wx.showModal({
                        title: '学号或密码错误',
                        showCancel: false,
                        content: '学号或者密码不正确，请检查后再尝试。可浏览器登录 http://jiaowu.dlpu.edu.cn 进行自我检查。[Error:' + res.data.code + ']', 
                        confirmColor: that.data.theme.color[that.data.theme.themeColorId].value
                    })
                }  //end of 密码错误
            } else {  //服务器被ban
                if(res.data.code == 403){
                    wx.showModal({
                        title: '请切换服务器',
                        content: '很遗憾，当前服务器暂时被ban，请切换服务器[Error:' + res.data.code + ']',
                        showCancel: false,
                        confirmText: "确定",
                        confirmColor: that.data.theme.color[that.data.theme.themeColorId].value
                    });
                }else{
                    wx.showModal({
                        title: '服务器故障',
                        content: '很遗憾，当前服务器暂时不可用，请在非高峰期再尝试[Error:' + res.data.code + ']',
                        showCancel: false,
                        confirmText: "确定",
                        confirmColor: that.data.theme.color[that.data.theme.themeColorId].value
                    });
                }
            }   //end of 服务器被ban
        }).catch((res) => { //验证失败
            wx.hideLoading();
            wx.showModal({
                title: '检测失败',
                content: '请检查手机网络，或当前服务器暂时不可用，或在非高峰期再尝试[Error:' + res.data.code + ']',
                showCancel: false,
                confirmText: "确定",
                confirmColor: that.data.theme.color[that.data.theme.themeColorId].value
            });
        });  // end of 验证失败
    }
})