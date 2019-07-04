// pages/more/more.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiimgs: [
      // '../../image/swi/swi01.jpg',
      //'../../image/swi/swi02.jpg',
      // '../../image/swi/swi03.jpg',
      '../../image/swi/morebg.png'
    ],
    hiddenmodalput: true,

    getindex: 0,  //最新获取的消息序号，用户用户点击关闭通知

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
      content: '即将免登录使用子程序“评教小助手”，是否立即打开？',
      showCancel: true,
      confirmColor: '#1298CF',
      success(res) {
        if (res.confirm) {
          wx.navigateToMiniProgram({
            appId: 'wx3f924baa54174a84',
            path: 'pages/index/index?user=' + userid + '&pass=' + passwd,
            envVersion: 'develop',
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
      confirmColor: '#1298CF',
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
      confirmColor: '#1298CF',
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
    that.getnews();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // wx.createSelectorQuery().select('.notice-bar').boundingClientRect((rect) => {
    //     console.log(rect);
    //   }).exec();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
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
  getnews: function(){
    var that = this;
    wx.request({
      url: 'https://test.1zdz.cn/api/getnews.php',
      success: function (res) {
        //console.log(res);
        var newsindex = wx.getStorageSync("newsindex");
        if (newsindex != undefined && newsindex != "" && newsindex != null){
          if(newsindex < res.data.index){
            that.setData({
              text: res.data.news,
              getindex: res.data.index,
              shownews: true
            });
            // var length = that.data.text.length * that.data.size;//文字长度
            // var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
            // that.setData({
            //   length: length,
            //   windowWidth: windowWidth
            // });
            //that.scrolltxt();// 第一个字消失后立即从右边出现

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
  //用户点击关闭通知
  // closeNews: function(){
  //   var that = this;
  //   var getindex = that.data.getindex;
  //   wx.setStorageSync("newsindex", getindex);
  //   that.getnews();
  // }
})