// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowserver: "",
    isSwitch: false
  },
  setwx: function () {
    wx.setClipboardData({
      data: 'http://dl.1zdz.cn',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '链接复制成功！',
              duration: 1000
            });
          }
        })
      }
    })
  },
  seturl: function () {
    wx.setClipboardData({
      data: 'http://download.1zdz.cn',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '网址复制成功！',
              duration: 1000
            });
          }
        })
      }
    })
  },
  modelSwitch: function (e) {
    var that = this;
    // console.log('携带值为', e.detail.value);
    if (e.detail.value == true){
      wx.setStorageSync('kcbaction', 'dym');
      wx.showModal({
        title: '提示',
        content: '实时课表：实时从教务处网站拉取数据，可能在用户使用高峰期，无法获取到数据。另外此模式下自定义课程无效。请悉知！',
        confirmText: "我知道了",
        confirmColor: "#1298CF",
        showCancel: false
      });
    }else{
      wx.setStorageSync('kcbaction', 'static'); 
      wx.showModal({
        title: '提示',
        content: '若有课程信息变动或者不准，请在学号和密码设置里重新更新课程表数据，请悉知！',
        confirmText: "我知道了",
        confirmColor: "#1298CF",
        showCancel: false
      });
    }
  }, 
  switchServer: function(){
    let that = this;
    wx.request({
      url: 'https://test.1zdz.cn/api/getserver.php',
      method: 'GET',
      success: function (res) {
        console.log(res);
        wx.setStorageSync("myserver", res.data.server);
        wx.setStorageSync("myserverindex", res.data.index);
        that.setData({
          nowserver: res.data.server.substring(8, 16)
        });
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let kcbaction = wx.getStorageSync("kcbaction");
    let myserver = wx.getStorageSync("myserver");
    that.setData({
      nowserver :　myserver.substring(8,16),
      isSwitch: kcbaction=="dym"? true : false,
    });
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