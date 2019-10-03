// pages/setting/setting.js
const app = getApp();
let rewardedVideoAd = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: app.globalData.theme,
    nowserver: "",
    isSwitch: false,
    incFre: app.globalData.countIncreseFre,
    incTime: app.globalData.countIncreseByTime,
    incAd: app.globalData.countIncreseByAD
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
        confirmColor: that.data.theme.color[that.data.theme.themeColorId].value,
        showCancel: false
      });
    }else{
      wx.setStorageSync('kcbaction', 'static'); 
      wx.showModal({
        title: '提示',
        content: '若有课程信息变动或者不准，请在学号和密码设置里重新更新课程表数据，请悉知！',
        confirmText: "我知道了",
        confirmColor: that.data.theme.color[that.data.theme.themeColorId].value,
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
    //主题更新
    that.setData({
      theme: app.getTheme()
    });
    let kcbaction = wx.getStorageSync("kcbaction");
    let myserver = wx.getStorageSync("myserver");
    that.setData({
      nowserver :　myserver.substring(8,16),
      isSwitch: kcbaction=="dym"? true : false
    });
    //视频广告
    if (wx.createRewardedVideoAd) {
      rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: 'adunit-cfdf2f4bd499a89d' })
      rewardedVideoAd.onLoad(() => {
        console.log('激励视频 广告加载成功')
      })
      rewardedVideoAd.onError((err) => {
        console.log('onError event emit', err)
      })
      rewardedVideoAd.onClose((res) => {
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          wx.setStorageSync("theEverydayCount", parseInt(wx.getStorageSync("theEverydayCount")) + app.globalData.countIncreseByAD);
          that.handleCountRefresh();
        } else {
          // 播放中途退出，不下发游戏奖励
        }
      })
    }
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
    let that = this;
    let kcbaction = wx.getStorageSync("kcbaction");
    //主题更新
    that.setData({
      theme: app.getTheme()
    });
    that.setData({
      theEverydayCount: wx.getStorageSync("theEverydayCount"),
      theEverydayUsed: wx.getStorageSync("theEverydayUsed"),
      isSwitch: kcbaction == "dym" ? true : false
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  handleCountRefresh: function () {
    let that = this;
    app.refreshCount();
    setTimeout(()=>{
      that.setData({
        theEverydayCount: wx.getStorageSync("theEverydayCount"),
        theEverydayUsed: wx.getStorageSync("theEverydayUsed")
      });
    },600)
  },
  handleWatchAd: function() {
    console.log('打开激励视频');
    // 在合适的位置打开广告
    if (rewardedVideoAd) {
      rewardedVideoAd.show()
        .then(() => console.log('激励视频 广告显示'))
        .catch(() => {
          rewardedVideoAd.load()
            .then(() => rewardedVideoAd.show())
            .catch(err => {
              console.log('激励视频 广告显示失败')
            })
        })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})