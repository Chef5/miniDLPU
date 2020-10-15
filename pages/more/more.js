// pages/more/more.js
const Water = require('../../utils/water');
//获取应用实例
const app = getApp();// 在页面中定义插屏广告
let interstitialAd = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: app.globalData.theme,
    swiimgs: [
      
    ],
    hiddenmodalput: true,

    getindex: 0,  //最新获取的消息序号，用户用户点击关闭通知

    isShowYuE: false, //校园卡余额
    isShowYuELoading: false,
    yue: {},

    isShowWaterPopup: false,     // 显示水卡弹窗
    isShowWaterProtocol: false,  // 协议、输入框
    isShowWaterInfo: false,      // 显示数据
    waterid: '',
    watername: '',
    waterpwd: '',
    isShowWater: false, //水卡
    isShowWaterLoading: false,
    water: {},
    waterqr: '',

    shownews: false,
    text: "",
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marquee_margin: 30,
    size: 14,
    interval: 14 // 时间间隔


  },
  //分享有礼
  share2getmoney: function () {
    var that = this;
    that.setData({
      hiddenmodalput: false,
    })
  },
  shareconfirm: function () {
    this.setData({
      hiddenmodalput: true
    })
  },
  //跳转小程序：评教小助手
  toPingJiaoProgram: function(){
    var userid = wx.getStorageSync('userid');
    var passwd = wx.getStorageSync('userpwd'); 
    wx.showModal({
      title: '提示',
      content: '2020-2021-1学期评教时间待定，评教小助手暂时无法使用',
      showCancel: true,
      confirmText: '立即前往',
      confirmColor: this.data.theme.color[this.data.theme.themeColorId].value,
      success(res) {
        if (res.confirm) {
          wx.navigateToMiniProgram({
            appId: 'wx3f924baa54174a84',
            path: 'pages/index/index?user=' + userid + '&pass=' + passwd,
            envVersion: 'release',
            success(res) {
              // 打开成功
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  //跳转小程序：校园采集平台
  toCaiJiProgram: function(){
    var userid = wx.getStorageSync('userid');
    var passwd = wx.getStorageSync('userpwd');
    wx.showModal({
      title: '提示',
      content: '一款面向学生班委的信息采集工具，支持自动整理导出Excel表格！点击确认即可免登录使用小程序“校园采集平台”，是否立即打开？',
      showCancel: true,
      confirmColor: this.data.theme.color[this.data.theme.themeColorId].value,
      success(res) {
        if (res.confirm) {
          wx.navigateToMiniProgram({
            appId: 'wxf885179f908a33d6',
            path: '/pages/index/index?s=1&u=' + userid + '&p=' + passwd,
            envVersion: 'release',
            success(res) {
              // 打开成功
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  //显示敬请期待
  showWaitingTips: function () {
    var that = this;
    // that.setData({
    //   hiddentips: false,
    // })
    wx.showModal({
      title: '提示',
      content: '四六级查询即将推出，敬请期待！',
      showCancel: false,
      confirmColor: that.data.theme.color[that.data.theme.themeColorId].value,
      success(res) {
        if (res.confirm) {
          
        } else if (res.cancel) {
          
        }
      }
    })
  },
  //显示更多提示
  showMoreTips: function () {
    var that = this;
    // that.setData({
    //   hiddentips: false,
    // })
    wx.showModal({
      title: '真幸运',
      content: '恭喜你获得一次向开发者提需求的机会，下一个新功能，你来提！',
      showCancel: true,
      confirmColor: that.data.theme.color[that.data.theme.themeColorId].value,
      confirmText: '我有想法',
      cancelText: '放弃机会',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../setting-detail/set-feed',
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let waterid = wx.getStorageSync('waterid') || wx.getStorageSync('userid');
    let watername = wx.getStorageSync('watername');
    let waterpwd = wx.getStorageSync('waterpwd');
    let isAgreeWaterProtocol = wx.getStorageSync('angreeWaterProtocl');
    //主题更新
    that.setData({
      theme: app.getTheme(),
      waterid,
      watername,
      waterpwd,
      isShowWaterProtocol: !!isAgreeWaterProtocol
    });
    that.getnews();
    that.getTopbarImg();
    InterstitialAd.load().catch((err) => {
      console.error('load',err)
    })        
    interstitialAd = qq.createInterstitialAd({
      adUnitId: '25dcc4f6c131fec9da00c2a8ce5159ae'
    })
    interstitialAd.onLoad(() => { })
    interstitialAd.onError((err) => { })
    interstitialAd.onClose(() => { })
    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    // wx.createSelectorQuery().select('.notice-bar').boundingClientRect((rect) => {
    //     console.log(rect);
    //   }).exec();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //主题更新
    that.setData({
      theme: app.getTheme()
    });
    console.log(wx.getStorageSync('newsindex'));
    that.getnews();//当重新回到此页面时，再次请求
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var shareObj = {
      title: "工大教务处-查课表、查成绩、查考试...",
      imgUrl: '/image/share.jpg',
      path: '/pages/kcb/kcb',
      desc: '可查详细的课程表、详细成绩，更多查询功能欢迎体验！'
    };
    // 返回shareObj
    return shareObj;
  },

  scrolltxt: function () {
    var that = this;
    var length = that.data.length;//滚动文字的宽度
    var windowWidth = that.data.windowWidth;//屏幕宽度
    if (length > windowWidth) {
      var interval = setInterval(function () {
        var maxscrollwidth = length + that.data.marquee_margin;
        var crentleft = that.data.marqueeDistance;
        if (crentleft < maxscrollwidth) {//判断是否滚动到最大宽度
          that.setData({
            marqueeDistance: crentleft + that.data.marqueePace
          })
        }
        else {
          //console.log("替换");
          that.setData({
            marqueeDistance: 0 // 直接重新滚动
          });
          clearInterval(interval);
          that.scrolltxt();
        }
      }, that.data.interval);
    }
    else {
      that.setData({ marquee_margin: "100" });//只显示一条不滚动右边间距加大，防止重复显示
    }
  },
  //获取通知
  getnews: function(){
    var that = this;
    wx.request({
      url: 'https://test.1zdz.cn/api/getnews.php',
      success: function (res) {
        // console.log(res);
        var newsindex = wx.getStorageSync("newsindex");
        if (newsindex != undefined && newsindex != "" && newsindex != null){
          if(newsindex < res.data.index){
            that.setData({
              text: res.data.news,
              getindex: res.data.index,
              shownews: true
            });
          }else{
            that.setData({
              shownews: false
            })
          }
        }
        else {
          wx.setStorageSync("newsindex", "0");
          that.getnews();
        }
      }
    });
  },
  //获取推广轮播图片
  getTopbarImg: function(){
    var that = this;
    wx.request({
      url: 'https://test.1zdz.cn/api/gettopbar.php',
      success: function (res) {
        console.log(res);
        let swis = that.data.swiimgs;
        if(res.data.url.length > 0) {
          for(let i=0;i<res.data.url.length;i++){
            swis.push(res.data.url[i]);
          }
          that.setData({swiimgs: swis, links: res.data.links, types: res.data.types, appid: res.data.appid });
        }
      }
    });
  },
  //点击轮播图
  showWebview: function(e){
    var that = this;
    console.log(that.data)
    // doc跳转公众号文章
    if(that.data.types[e.currentTarget.dataset.index] == "doc"){
      wx.navigateTo({
        url: './ad/ad?url='+that.data.links[e.currentTarget.dataset.index]
      })
    }else if(that.data.types[e.currentTarget.dataset.index] == "app"){
      wx.navigateToMiniProgram({
        appId: that.data.appid[e.currentTarget.dataset.index],
        path: that.data.links[e.currentTarget.dataset.index],
        success(res) {
          // 打开成功
        }
      })
    }
  },

  // 余额弹窗
  showYuE: function(){
    let that = this;
    that.setData({ 
      isShowYuE:true,
      isShowYuELoading: true,
    });
    var userid = wx.getStorageSync('userid');
    if(userid){
      wx.request({
        url: 'https://test.1zdz.cn/api/card.php',
        method: 'POST',
        data: {
          userid: userid
        },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {
          if(res.data.success == 0){
            var yue = res.data;
            var dt = new Date();
            yue.time = dt.getFullYear() +'-'+ 
                      addZero(dt.getMonth()) +'-'+ 
                      addZero(dt.getDay()) +' '+ 
                      addZero(dt.getHours()) +':'+ addZero(dt.getMinutes()) +':'+ addZero(dt.getSeconds());
            
            that.setData({ 
              yue: yue,
              isShowYuELoading: false,
            });
          }
        },
        fail: function (res) {}
      });
    }
    function addZero(i){
      if (i<10) {
        i="0" + i;
      }
      return i;
    }
  },

  // 水卡弹窗
  checkWater: function(){
    let that = this;
    let waterid = this.data.waterid;
    let watername = this.data.watername;
    let waterpwd = this.data.waterpwd;
    let isAgreeWaterProtocol = wx.getStorageSync('angreeWaterProtocl');
    // 显示弹窗
    this.setData({
      isShowWaterPopup: true,
    });
    if(isAgreeWaterProtocol && waterid && watername && waterpwd) {
      this.checkWaterAcount();
      that.setData({ 
        isShowWaterInfo: true,
      });
    }else {
      console.log("无水卡账号信息");
      this.setData({ 
        isShowWaterProtocol: true,
      })
    }
  },
  // 水卡协议同意
  waterProtocolAgree: function(){
    wx.setStorageSync('angreeWaterProtocl', true);
    this.setData({ 
      isShowWaterProtocol: false
    });
  },
  // 水卡输入信息
  getwaterid: function(e){
    this.setData({
      waterid: e.detail.value
    });
    return e.detail.value;
  }, 
  getwatername: function (e) {
    this.setData({
      watername: e.detail.value
    });
    return e.detail.value;
  },
  getwaterpwd: function (e) {
    this.setData({
      waterpwd: e.detail.value
    });
    return e.detail.value;
  },
  // 检测用户水卡账号
  checkWaterAcount: function() {
    let that = this;
    let waterid = this.data.waterid;
    let watername = this.data.watername;
    let waterpwd = this.data.waterpwd;
    Water.getToken({
      realname: watername,
      studentID: waterid,
      password: waterpwd
    }).then(token=>{
      console.log('token：' + token);
      wx.setStorageSync('waterid', waterid);
      wx.setStorageSync('watername', watername);
      wx.setStorageSync('waterpwd', waterpwd);
      that.setData({
        waterToken: token,
        isShowWaterInfo: true,
      });
      that.getWaterInfo();
    }).catch(err=>{
      console.log(err);
      wx.showModal({
        title: '错误',
        content: err,
        showCancel: false,
        confirmText: '确定',
        confirmColor: that.data.theme.color[that.data.theme.themeColorId].value
      });
    });
  },
  // 水卡数据
  getWaterInfo: function() {
    let that = this;
    // 获取水卡信息
    Water.getWater(this.data.waterToken).then(res=>{
      console.log('水卡信息', res);
      that.setData({ water: res });
    }).catch(err=>{
      console.log(err);
    });

    // 获取消费二维码
    Water.getPrcode(this.data.waterToken).then(res=>{
      console.log('二维码地址', res);
      that.setData({ waterqr: res });
    }).catch(err=>{
      console.log(err);
    });
  },
  // 清除水卡账号
  clearWaterInfo: function() {
    wx.removeStorageSync('watername');
    wx.removeStorageSync('waterpwd');
    wx.setStorageSync('angreeWaterProtocl', false);
    this.setData({
      waterToken: '',
      watername: '',
      waterpwd: '',
      isShowWaterInfo: false,
      isShowWaterProtocol: true
    });
  },


  onClose: function(){
    this.setData({ 
      isShowYuE: false,
      isShowWaterPopup: false,
    })
  }
})