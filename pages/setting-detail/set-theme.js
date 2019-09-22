// pages/setting-detail/set-theme.js
//获取应用实例
const app = getApp();
// 在页面中定义插屏广告
let interstitialAd = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: "loading",
    theme: {},
    colors: [],
    colorSel: null,
    trans: 25
  },

  onLoad: function (options) {
    let that = this;
    let theme = app.getTheme();
    //透明度获取
    let themeTransparency = wx.getStorageSync("ThemeTransparency") || 26;
    //设置选项
    let colors = theme.color;
    for (let i = 0; i < colors.length; i++) {
      colors[i].checked = false;
    }
    colors[theme.themeColorId].checked = true;
    // console.log(theme);
    // console.log(colors);
    that.setData({
      theme: theme,
      colors: colors,
      colorSel: colors[theme.themeColorId].value,
      trans: themeTransparency - 1
    });

    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-59796b720956f5f6'
      })
      interstitialAd.onLoad(() => { })
      interstitialAd.onError((err) => { })
      interstitialAd.onClose(() => { })
    }

    
  },
  onShow: function () {
    // let that = this;
    // //主题更新
    // that.setData({
    //   theme: app.getTheme()
    // });
    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },

  //选择图片
  chooseImage: function(){
    let that = this;
    var FSM = wx.getFileSystemManager(); 
    wx.chooseImage({
      count: 1,
      success: function(res) {
        console.log(res)
        FSM.readFile({
          filePath: res.tempFilePaths[0],
          encoding: "base64",
          success: function (res) {
            wx.setStorageSync("ThemeImage", res.data);
            let theme = that.data.theme;
            theme.image = res.data;
            that.setData({
              theme: theme
            });
            wx.showToast({
              title: '设置成功',
            })
          }
        });
      },
    })
  },
  //清除图片
  clearImage: function() {
    wx.setStorageSync("ThemeImage",null)
    app.globalData.theme.image = null;
    let theme = this.data.theme;
    theme.image = null;
    this.setData({
      theme: theme
    });
    wx.showToast({
      title: '已清除',
    })
  },
  //单选数据初始化
  radioChange: function (e) {
    var that = this;
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var colors = that.data.colors;
    for (var i = 0, len = colors.length; i < len; ++i) {
      // colors[i].checked = colors[i].value == e.detail.value;
      if (colors[i].value == e.detail.value){
        colors[i].checked = true;
        wx.setStorageSync("ThemeColorId", i);
        app.globalData.theme.themeColorId = i;
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: e.detail.value,
        })
      }else{
        colors[i].checked = false;
      }

    }
    that.setData({
      colors: colors,
      colorSel: e.detail.value
    });

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: e.detail.value,
    })
    wx.showToast({
      title: '更换成功',
      duration: 1000
    });
  },
  //透明度设置
  sliderChange: function(e){
    let that = this;
    // console.log(e.detail.value);
    wx.setStorageSync("ThemeTransparency", e.detail.value+1);
    that.setData({
      trans: e.detail.value
    })
  }
})