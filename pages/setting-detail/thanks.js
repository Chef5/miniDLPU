// pages/setting-detail/thanks.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  seturl: function () {
    wx.setClipboardData({
      data: 'https://download.1zdz.cn',
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
  onShow: function () {
    let that = this;
    //主题更新
    that.setData({
      theme: app.getTheme()
    });
  },
  onLoad: function () {
    let that = this;
    that.setData({
      theme: app.getTheme()
    });
  },
})