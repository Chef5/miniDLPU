// pages/more/ksrc/ksrc.js
// pages/cj/cj.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalput: true,
    name: "",
    room: "",
    time: "",
    id: "",
    cc: "",
    ident: "",
    num: 0,
    index:0,
    array: [
      { name: "", room: "", time: "", id: "", cc: "", ident: "" },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //刷新本地账号
    var Id = wx.getStorageSync("userid");
    var Pwd = wx.getStorageSync("userpwd");
    var Server = wx.getStorageSync("server");
    that.refreshKSRC();
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
    return {
      title: '工大教务处-考试查询',
      desc: '可查详细的课程表、详细成绩，更多查询功能欢迎体验！',
      path: '/pages/more/ksrc/ksrc'
    };
  },
  //成绩刷新
  refreshKSRC: function () {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    //显示等待提示
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 1000
    });
    //刷新本地账号
    var Id = wx.getStorageSync("userid");
    var Pwd = wx.getStorageSync("userpwd");
    var Server = wx.getStorageSync("server");
    that.requestKSRC(Id, Pwd, Server);  
    //停止刷新
    wx.stopPullDownRefresh();
    // 隐藏顶部刷新图标
    wx.hideNavigationBarLoading();
  },
  //成绩请求单独作为一个方法
  requestKSRC: function (Id, Pwd, Server) {
    var that = this;
    if (Id == '' && Pwd == '') {
      wx.showModal({
        content: '本地不存在教务处账号和密码，请点击:“设置”>“教务处信息更改”',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            //停止刷新
            wx.stopPullDownRefresh();
            // 隐藏顶部刷新图标
            wx.hideNavigationBarLoading();
          }
        }
      });
      return;
    }
    if (Id == null) {
      return;
    }
    Pwd = encodeURIComponent(Pwd); //转义，防止有特殊字符如：&
    wx.request({
      url: 'https://test.1zdz.cn/api/ksrc.php',
      method: 'POST',
      data: {
        id: Id,
        pwd: Pwd,
        server: Server
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log(res);
        var change = [];
        for (var i = 0; i < res.data.data.length; i++) {
          change[i] = new Object();
          change[i].name = that.isOver16(res.data.data[i].name);
          change[i].room = res.data.data[i].room;
          change[i].cc = res.data.data[i].cc;
          change[i].time = res.data.data[i].time;
          change[i].ident = res.data.data[i].ident;
          change[i].id = res.data.data[i].id;
        }
        console.log(change);
        that.setData({ 
          array: change,
          num: res.data.data.length,
          });
      },
      fail: function (res) {
        console.log("获取成绩失败！");
        wx.showToast({
          title: '获取失败！',
          duration: 1000
        });
        //停止刷新
        wx.stopPullDownRefresh();
        // 隐藏顶部刷新图标
        wx.hideNavigationBarLoading();
      },
      complete: function (res) {
        //停止刷新
        wx.stopPullDownRefresh();
        // 隐藏顶部刷新图标
        wx.hideNavigationBarLoading();
      }
    });
    //停止刷新
    wx.stopPullDownRefresh();
    // 隐藏顶部刷新图标
    wx.hideNavigationBarLoading();
  },
  isOver16: function (str) {
    if (str.length > 16) {
      return str.substring(0, 15) + "...";
    }
    else return str;
  },
  isOver11: function (str) {
    if (str.length > 11) {
      return str.substring(0, 10) + "...";
    }
    else return str;
  },
  showdetail: function (e) {
    console.log(e);
    var that = this;
    var noshow = false;
    var name = e.currentTarget.dataset.name;
    var room = e.currentTarget.dataset.room;
    var time = e.currentTarget.dataset.time;
    var cc = e.currentTarget.dataset.cc;
    var id = e.currentTarget.dataset.id;
    var ident = e.currentTarget.dataset.ident;
    if (name == "") noshow = true;
    that.setData({
      hiddenmodalput: noshow,
      name: name,
      room: room,
      cc: cc,
      time: time,
      id: id,
      ident: ident
    })
  },
  confirm: function () {
    this.setData({
      hiddenmodalput: true
    })
  }
})