// pages/setting-detail/set-other.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowFeedback: false,
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

  // 打开、关闭反馈弹框
  showFeedback: function () {
    this.setData({
      isShowFeedback: true,
    });
  },
  onClose: function () {
    this.setData({
      isShowFeedback: false,
    });
  }


})