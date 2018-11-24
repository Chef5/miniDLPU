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
        wx.setClipboardData({
          data: '小伙伴们，快来试手气赢 Apple 美国总部免费游！poRhYz38ct 你去美国我来买单！#吱口令#长按复制此消息，打开支付宝就能领取！',
          success: function (res) {
            wx.showModal({
              title: '提示',
              content: '推荐成功，恭喜获得App store 5元红包，马上打开支付宝即可领取！',
              confirmText: "知道啦",
              showCancel: false,
              success: function (res) {
                console.log(res);
                if (res.confirm) {
                  console.log('用户点击主操作');
                } else {
                  console.log('用户点击辅助操作')
                }
              }
            });
          }
        })
      }
  　　};
  　　// 返回shareObj
  　　return shareObj;
  }
})