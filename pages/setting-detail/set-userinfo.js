// pages/setting-userinfo/set-userinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid:'',
    userpwd:'',
    hidpwd:'',
  },
  saveUserinfo:function(e){
    var that = this;
    if (e.detail.value.userid != '') {
      wx.setStorage({
        key: 'userid',
        data: e.detail.value.userid,
      });
      wx.setStorage({
        key: 'userpwd',
        data: e.detail.value.userpwd,
      });
      var hidpwd = that.hiddesome(e.detail.value.userpwd);
      that.setData({ hidpwd: hidpwd, });
      console.log('userid:' + e.detail.value.userid);
      console.log('userpwd:' + e.detail.value.userpwd);
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
    wx.showModal({
      title: '保存成功！',
      content: '学号和密码已保存至微信缓存，现在可以返回课程表页面下拉刷新课表了。',
      confirmText: "立即前往",
      cancelText: "再看看",
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