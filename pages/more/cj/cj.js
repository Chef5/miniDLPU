// pages/cj/cj.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cjnowxq:6,
    arrayxq: [
      '2015-2016-1', 
      '2015-2016-2', 
      '2016-2017-1', 
      '2016-2017-2', 
      '2017-2018-1',
      '2017-2018-2',
      '2018-2019-1', 
      '2018-2019-2'],
    hiddenmodalput: true,
    name:"",
    grade:"",
    pscjb:"",
    pscj: "",
    qzcjb: "",
    qzcj: "",
    qmcjb:"",
    qmcj:"",
    credit: "",
    point: "",
    hour: "",
    method: "",
    kcsx: "",
    kcxz: "",
    arraycj: [],//{ name: "", grade: "", pscjb: "", pscj: "", qzcjb: "", qzcj: "", qmcjb: "", qmcj: "", credit: "", point: "", hour: "", method: "", kcsx: "", kcxz: ""}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.refreshCJ();
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
      title: '工大教务处-成绩查询',
      desc: '可查详细的课程表、详细成绩，更多查询功能欢迎体验！',
      path: '/pages/more/cj/cj'
    };
  },
  bindPickerChange: function (e) {
    var that = this;
    that.setData({
      cjnowxq: e.detail.value
    });
    that.refreshCJ();
  },
  //成绩刷新
  refreshCJ:function(){
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    //显示等待提示
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 4500
    });
    //获取本地账号
    var Id = wx.getStorageSync('userid');
    var Pwd = wx.getStorageSync('userpwd'); 
    var Server = wx.getStorageSync('server');
    that.setData({ userid: Id, userpwd: Pwd});
    if (Server == null) {
      Server = "210.30.62.37";
      wx.setStorage({
        key: 'server',
        data: "210.30.62.37",
      });
    }
    that.requestCJ(Id, Pwd, Server);
    //停止刷新
    wx.stopPullDownRefresh();
    // 隐藏顶部刷新图标
    wx.hideNavigationBarLoading();
  },
  //成绩请求单独作为一个方法
  requestCJ:function(Id,Pwd,Server){
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
    var items = that.data.arrayxq[that.data.cjnowxq];
    Pwd = encodeURIComponent(Pwd); //转义，防止有特殊字符如：&
    console.log("item:" + items);
    wx.request({
      url: 'https://test.1zdz.cn/api/cj.php',
      method: 'POST',
      data: {
        id: Id,
        pwd: Pwd,
        item: items,
        server: Server
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log(res);
        var changeCJ = [];
        if(res.data.state=="error"){
          wx.showModal({
            content: '学号或者密码错误，登陆教务处失败！或更换教务处服务器试试。',
            showCancel: true,
            confirmText: "查看学号和密码",
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
                wx.navigateTo({
                  url: '../../setting-detail/set-userinfo',
                })
              }
            }
          });
        }else{
          for (var i = 0; i < res.data.length; i++) {
            changeCJ[i] = new Object();
            changeCJ[i].name = that.isOver16(res.data[i].name);
            changeCJ[i].grade = res.data[i].grade;
            changeCJ[i].pscjb = res.data[i].detail.pscjb;
            changeCJ[i].pscj = res.data[i].detail.pscj;
            changeCJ[i].qzcjb = res.data[i].detail.qzcjb;
            changeCJ[i].qzcj = res.data[i].detail.qzcj;
            changeCJ[i].qmcjb = res.data[i].detail.qmcjb;
            changeCJ[i].qmcj = res.data[i].detail.qmcj;
            changeCJ[i].credit = res.data[i].detail.credit;
            changeCJ[i].point = res.data[i].detail.point;
            changeCJ[i].hour = res.data[i].detail.hour;
            changeCJ[i].method = res.data[i].detail.method;
            changeCJ[i].kcsx = res.data[i].detail.kcsx;
            changeCJ[i].kcxz = res.data[i].detail.kcxz;
          }
        }
        //console.log(changeCJ);
        if (changeCJ.length == 0){
          wx.showToast({
            title: '暂无本学期成绩',
            duration: 2000
          })
        }
        that.setData({ arraycj: changeCJ, });
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
    if (str.length >11) {
      return str.substring(0, 10) + "...";
    }
    else return str;
  },
  showdetail: function (e) {
    console.log(e);
    var that = this;
    var noshow = false;
    var gname = that.isOver11(e.currentTarget.dataset.name);
    var ggrade = e.currentTarget.dataset.grade;
    var gpscjb = e.currentTarget.dataset.pscjb;
    var gpscj = e.currentTarget.dataset.pscj;
    var gqzcjb = e.currentTarget.dataset.qzcjb;
    var gqzcj = e.currentTarget.dataset.qzcj;
    var gqmcjb = e.currentTarget.dataset.qmcjb;
    var gqmcj = e.currentTarget.dataset.qmcj;
    var gcredit = e.currentTarget.dataset.credit;
    var gpoint = e.currentTarget.dataset.point;
    var ghour = e.currentTarget.dataset.hour;
    var gmethod = e.currentTarget.dataset.method;
    var gkcsx = e.currentTarget.dataset.kcsx;
    var gkcxz = e.currentTarget.dataset.kcxz;
    if (gname == "" || ggrade == "") noshow = true;
    that.setData({
      hiddenmodalput: noshow,
      name: gname,
      grade: ggrade,
      pscjb: gpscjb,
      pscj: gpscj,
      qzcjb: gqzcjb,
      qzcj: gqzcj,
      qmcjb: gqmcjb,
      qmcj: gqmcj,
      credit: gcredit,
      point: gpoint,
      hour: ghour,
      method: gmethod,
      kcsx: gkcsx,
      kcxz: gkcxz
    })
  },
  confirm: function () {
    this.setData({
      hiddenmodalput: true
    })
  }
})