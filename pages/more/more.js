// pages/more/more.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiimgs: [
      // '../../image/swi/swi01.jpg',
      '../../image/swi/swi02.jpg',
      // '../../image/swi/swi03.jpg',
    ],
    hiddenmodalput: true,
  },
  share2getmoney: function () {
    var that = this;
    that.setData({
      hiddenmodalput: false,
    })
    // wx.showModal({
    //   title: '分享可以赚红包啦',
    //   content: '推荐工大教务处小程序到群聊后即可以领取支付宝红包，最高可领888元，每日都有。',
    //   confirmText: "现在分享",
    //   cancelText: "稍后再说",
    //   success: function (res) {
    //     console.log(res);
    //     if (res.confirm) {
    //       console.log('用户点击主操作');
    //       that.onShareAppMessage();
    //     } else {
    //       console.log('用户点击辅助操作')
    //     }
    //   }
    // });
  },
  shareconfirm: function () {
    this.setData({
      hiddenmodalput: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this;
    　　var shareObj = {
      title: "工大教务处-查课表、查成绩、查考试...",
      imgUrl: '/image/share.jpg',
      path: '/pages/kcb/kcb',
      desc: '可查详细的课程表、详细成绩，更多查询功能欢迎体验！',
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {

        }
      },
      fail: function () {
        if (res.errMsg == 'shareAppMessage:fail cancel') { }
        else if (res.errMsg == 'shareAppMessage:fail') { }
      },
      complete: function () {
        
      }
  　　};
  　　// 返回shareObj
  　　return shareObj;
  }
})