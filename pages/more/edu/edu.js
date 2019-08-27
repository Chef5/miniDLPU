// pages/more/edu/edu.js
//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalput: true,
    id: "",
    name: "",
    credit: "",
    ehour: "",
    hour: "",
    item: "",
    method: "",
    org: "",
    index: 0,
    index2: 0,
    array: [],
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
    that.refreshEDU();
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
      title: '工大教务处-培养方案查询',
      desc: '可查详细的课程表、详细成绩，更多查询功能欢迎体验！',
      path: '/pages/more/more'
    };
  },
  //培养方案刷新
  refreshEDU: function () {
    var that = this;
    if (!app.delCount()) {
      return ;
    }
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    //显示等待提示
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 1500
    });
    //刷新本地账号
    var Id = wx.getStorageSync("userid");
    var Pwd = wx.getStorageSync("userpwd");
    var Server = wx.getStorageSync("server");
    that.requestEDU(Id, Pwd, Server);
    //停止刷新
    wx.stopPullDownRefresh();
    // 隐藏顶部刷新图标
    wx.hideNavigationBarLoading();
  },
  //培养方案请求单独作为一个方法
  requestEDU: function (Id, Pwd, Server) {
    var that = this;
    if (Id == '' && Pwd == '') {
      wx.showModal({
        content: '缓存里没有你的学号和密码，请点击:“设置”>“学号和密码”',
        showCancel: true,
        confirmText: "立即前往",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            //停止刷新
            wx.stopPullDownRefresh();
            // 隐藏顶部刷新图标
            wx.hideNavigationBarLoading();
            wx.navigateTo({
              url: '../../setting-detail/set-userinfo',
            })
          }
        }
      });
      return;
    }
    if (Id == null) {
      return;
    }
    Pwd = encodeURIComponent(Pwd); //转义，防止有特殊字符如：&
    var WannaKey = app.encryptUserKey(Id, Pwd);
    var reurl = wx.getStorageSync('myserver');
    // var reurl = "https://test.1zdz.cn";
    console.log("当前请求服务器：" + reurl);
    wx.request({
      url: reurl+'/api/edu.php',
      method: 'POST',
      data: {
        XiangGanMa: WannaKey,
        server: Server
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        //console.log(res);
        //console.log(res.data[0][0].name);
        if (res.data != null) {
          var Eduarray = [];
          for (var it = 0; it < 8; it++) {
            var change = [];
            for (var i = 0; i < res.data[it].length; i++) {
              change[i] = new Object();
              change[i].name = that.isOver16(res.data[it][i].name);
              change[i].id = res.data[it][i].id;
              change[i].item = res.data[it][i].item;
              change[i].hour = res.data[it][i].hour;
              change[i].ehour = res.data[it][i].ehour;
              change[i].credit = res.data[it][i].credit;
              change[i].method = res.data[it][i].method;
              change[i].org = res.data[it][i].org;
            }
            Eduarray[it] = change;
          }
          console.log(Eduarray);
          that.setData({
            array: Eduarray
          });
       }
      },
      fail: function (res) {
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
  showdetail: function (e) {
    console.log(e);
    var that = this;
    var noshow = false;
    var name = e.currentTarget.dataset.name;
    var id = e.currentTarget.dataset.id;
    var credit = e.currentTarget.dataset.credit;
    var ehour = e.currentTarget.dataset.ehour;
    var hour = e.currentTarget.dataset.hour;
    var item = e.currentTarget.dataset.item;
    var method = e.currentTarget.dataset.method;
    var org = e.currentTarget.dataset.org;
    if (name == "") noshow = true;
    that.setData({
      hiddenmodalput: noshow,
      name: name,
      id: id,
      name: name,
      credit: credit,
      ehour: ehour,
      hour: hour,
      item: item,
      method: method,
      org: org
    })
  },
  confirm: function () {
    this.setData({
      hiddenmodalput: true
    })
  }
})