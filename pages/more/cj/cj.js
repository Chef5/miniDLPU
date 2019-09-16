// pages/cj/cj.js
//获取应用实例
const app = getApp();
let rewardedVideoAd = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cjnowxq:7,
    Avgcredit: '--',
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
          that.refreshCJ();
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
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    that.setData({
      arraycj:[]
    });
    that.refreshCJ();
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
    if (!app.delCount()) {
      wx.showModal({
        content: '您当前查询次数剩余量为0，请等待' + app.globalData.countIncreseFre + '秒 后再试！服务器资源有限，请理解。您可在设置中查询今日总额度以及剩余额度，还可以赚取额外次数！完整观看广告，可立即+' + app.globalData.countIncreseByAD + '次！',
        showCancel: true,
        title: "查询次数已耗尽",
        confirmText: "观看广告",
        success: function (res) {
          if (res.confirm) {
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
          }
        }
      });
      return;
    }
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    //显示等待提示
    wx.showToast({
      title: '成绩加载中',
      icon: 'loading',
      duration: 4000
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
    var WannaKey = app.encryptUserKey(Id, Pwd);
    console.log("item:" + items);
    //console.log("Server:" + Server);
    var reurl = wx.getStorageSync('myserver');
    //var reurl = "https://server-2.isdz.cn";
    console.log("当前请求服务器：" + reurl);
    wx.request({
      url: reurl+'/api/cj.php',
      method: 'POST',
      data: {
        XiangGanMa: WannaKey,
        item: items,
        server: Server
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log(res);
        var changeCJ = [];
        var creNum = '';
        if(res.data.state=="error"){
          wx.showModal({
            content: '登陆教务处失败！可能当前服务器暂时被ban了，更换一台试试？也可能是学号或者密码错了喔',
            showCancel: true,
            confirmText: "前往切换",
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
                wx.navigateTo({
                  url: '../../setting-detail/set-server',
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
          });
          creNum = '-';
        }else{
          creNum = res.data[0].creNum;
        }
        that.setData({ arraycj: changeCJ, Avgcredit: creNum});
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