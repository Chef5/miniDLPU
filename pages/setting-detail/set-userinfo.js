// pages/setting-userinfo/set-userinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid:'',
    userpwd:'',
    hidpwd:'',
    updatetime: '0000-00-00 00:00:00',
  },
  getuserid: function(e){
    var userid = e.detail.value;
    this.setData({
      userid: userid
    })
  }, 
  getuserpwd: function (e) {
    var userpwd = e.detail.value;
    this.setData({
      userpwd: userpwd
    })
  },
  //模式1 课程表数据抓取
  storeKcb: function(){
    var that = this;
    var userid = that.data.userid;
    var userpwd = that.data.userpwd;
    //console.log(userid+userpwd);
    if(userid.length != 10){
      wx.showModal({
        title: '学号错误',
        showCancel: false,
        content: '学号位数不对！当前位数：'+userid.length,
      })
    }else{
      wx.showToast({
        title: '玩命抓取中...',
        icon: 'loading',
        duration: 15000
      });
      that.saveUserinfo(that.data.userid, that.data.userpwd);
      var reurl = wx.getStorageSync('myserver');
      // var reurl = "https://test.1zdz.cn";
      console.log(reurl);
      wx.request({
        url: reurl+'/api/storekcb.php',
        method: 'POST',
        data: {
          userid: userid,
          userpwd: userpwd,
        },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {
          console.log(res);
          if(res.data.code==100){
            wx.setStorageSync('kcbaction', 'static');
            wx.showToast({
              title: '抓取完成',
              icon: 'success',
              duration: 2000,
              complete: function(){
                wx.showModal({
                  title: '抓取完成',
                  content: '课程表数据获取完成，现在可以返回课程表页面下拉刷新课表了。',
                  confirmText: "立即前往",
                  cancelText: "留下",
                  success: function (res) {
                    if (res.confirm) {
                      wx.reLaunch({
                        url: '../kcb/kcb',
                      })
                    } else {
                      console.log('用户想了想')
                    }
                  }
                });
              }
            });
            that.setData({updatetime:res.data.time});
            wx.setStorageSync('updatetime', res.data.time);
          }else{
            wx.setStorageSync('kcbaction', 'dym');
            wx.showModal({
              title: '抓取出错',
              showCancel: false,
              content: '服务器崩溃或者学号密码出错，请检查或更换服务器！',
            })
          }
        },
        fail: function (res) {
          wx.setStorageSync('kcbaction', 'dym');
          wx.showModal({
            title: 'Error',
            showCancel: false,
            content: '网络错误',
          })
        },
        complete: function (res) {
          
        }
      });
    }
  },
  //模式2 仅储存
  storeUser: function(){
    var that = this;
    that.saveUserinfo(that.data.userid, that.data.userpwd);
    wx.setStorageSync('kcbaction', 'dym');
    wx.showModal({
      title: '保存成功！',
      content: '学号和密码已保存至微信缓存，立即返回首页？',
      confirmText: "到首页",
      cancelText: "留下来",
      success: function (res) {
        if (res.confirm) {
          wx.reLaunch({
            url: '../kcb/kcb',
          })
        } else {
          console.log('用户想了想')
        }
      }
    });
  },

  saveUserinfo:function(userid,userpwd){
    var that = this;
    if (userid != '') {
      wx.setStorage({
        key: 'userid',
        data: userid,
      });
      wx.setStorage({
        key: 'userpwd',
        data: userpwd,
      });
      var hidpwd = that.hiddesome(userpwd);
      that.setData({ hidpwd: hidpwd, });
      console.log('userid:' + userid);
      console.log('userpwd:' + userpwd);
    }else{
      wx.setStorage({
        key: 'userid',
        data: '',
      });
      wx.setStorage({
        key: 'userpwd',
        data: '',
      });
      that.setData({ hidpwd: "无", });
    }
    // wx.showToast({
    //   title: '保存成功！',
    //   duration: 1000
    // });
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that= this;
    wx.getStorage({
      key: 'userid',success: function(res){that.setData({userid: res.data, });},
    });
    wx.getStorage({
      key: 'userpwd', success: function (res) { 
        that.setData({ userpwd: res.data, });
        if (res.data == null || res.data == ''){ that.setData({ hidpwd: '无', });}
        else {
          var hidpwd = that.hiddesome(res.data); that.setData({ hidpwd: hidpwd, });
        }
        },fail(){
          that.setData({ hidpwd: '无', });
        }
    });
    var uptime = wx.getStorageSync('updatetime');
    if(uptime!=''&&uptime!=undefined&&uptime!=null)that.setData({ updatetime: uptime});
    else that.setData({ updatetime: '暂无' });
    
  },
  //判断课程字数是否超出小方块
  hiddesome: function (str) {
    var str1 = str.substring(0, 2);
    var str2 = "";
    for (var i = 0; i < str.length - 3; i++)str2+="*";
    var str3 = str.substring(str.length - 1, str.length);
    return str1+str2+str3;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})