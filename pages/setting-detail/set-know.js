// pages/setting-detail/set-know.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onShow: function(){
    let that = this;
    //主题更新
    that.setData({
      theme: app.getTheme()
    });
  },
  onLoad: function(){
    let that = this;
    //主题更新
    that.setData({
      theme: app.getTheme()
    });
  },
  //跳转到userinfo
  toUserinfo: function(){
    wx.navigateTo({
      url: './set-userinfo',
    })
  },
  //跳转到server
  toServer: function () {
    wx.navigateTo({
      url: './set-server',
    })
  },
  //跳转到feed
  toFeed: function () {
    wx.navigateTo({
      url: './set-feed',
    })
  },
  //跳转到ad
  toAd: function () {
    wx.navigateTo({
      url: './set-ad',
    })
  },
  //复制教务处登录Url
  copyUrl: function(){
    wx.setClipboardData({
      data: 'http://210.30.62.37:8080/jsxsd',
      success: function (res) {
        wx.showToast({
          title: '复制成功！',
          duration: 1000
        });
      }
    })
  },
  //恢复通知显示
  reShowNews: function(){
    wx.setStorageSync("newsindex", '0');
    wx.showToast({
      title: '恢复成功！',
      duration: 1000
    });
  },
  //下方显示通知
  showNewsBox: function(){
    var that = this;
    wx.request({
      url: 'https://test.1zdz.cn/api/getnews.php',
      success: function (res) {
        that.setData({ newsbox: res.data.news});
      }
    })
  },
  //重置查询次数
  resetCount: function(){
    app.resetCount();
    wx.showToast({
      title: '重置成功！',
      duration: 1000
    });
  }
})