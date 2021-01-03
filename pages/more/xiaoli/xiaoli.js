// pages/more/xiaoli/xiaoli.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
    //主题更新
    that.setData({
      theme: app.getTheme()
    });
  },
})