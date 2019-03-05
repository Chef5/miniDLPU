// pages/more/room/room.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    house: ["综合楼A", "综合楼B", "国教", "艺术学院", "服装学院", "综合楼C", "机电楼"],
    zc:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
    week: [{ index: 1, show: "一" }, { index: 2, show: "二" }, { index: 3, show: "三" }, { index: 4, show: "四" }, { index: 5, show: "五" }, { index: 6, show: "六" }, { index: 7, show: "日" }],
    time: [{ index: 1, show: "1,2" }, { index: 1, show: "3,4" }, { index: 1, show: "5,6" }, { index: 1, show: "7,8" }, { index: 1, show: "9,10" }],
    index_h:0,
    index_z:0,
    index_w:0,
    index_t:0,
    show_res:true,
    hidmodal:true,
    res_num:8,
    rooms: []
  },
  houseChange: function (e) {
    var that = this;
    that.setData({
      index_h: e.detail.value
    });
  },
  zcChange: function (e) {
    var that = this;
    that.setData({
      index_z: e.detail.value
    });
  },
  weekChange: function (e) {
    var that = this;
    that.setData({
      index_w: e.detail.value
    });
  },
  timeChange: function (e) {
    var that = this;
    that.setData({
      index_t: e.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var nowzc = wx.getStorageSync('nowzc');
    var nowtime = new Date();  //当前时间
    //var day = nowtime.getFullYear() + "年" + (parseInt(nowtime.getMonth())+1) + "月" + nowtime.getDate() + "日";
    var week = nowtime.getDay();
    //---修复Bug：周日是0，所以不能直接减一 
    if (week==0)week=6;
    else week = week-1;
    this.setData({
      index_z: nowzc-1,
      index_w: week,
      show_res: false
    });
    //console.log(options);
    //二维码 识别设置
    var scene = decodeURIComponent(options.scene);
    if(scene != 'undefined'){
      that.setData({
        index_h: scene
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '工大教务处-空教室查询',
      desc: '可查详细的课程表、详细成绩，更多查询功能欢迎体验！',
      path: '/pages/more/room/room'
    };
  },
  /**
   * 开始查询--先隐藏之前结果再显示当前结果
   */
  serchRoom: function(){
    var that = this;
    //先隐藏之前的结果
    that.setData({
      show_res: false
    });
    //转圈圈
    wx.showToast({
      title: '光速查询中...',
      icon: 'loading',
      duration: 700
    });
    //获取查询参数
    var hid = that.data.house[that.data.index_h];
    var zid = parseInt(that.data.index_z)+1;
    var wid = parseInt(that.data.index_w)+1;
    var tid = parseInt(that.data.index_t) + 1;
    var sid = wx.getStorageSync('userid');//统计
    // console.log("hid="+hid+";zid="+zid+";wid="+wid+";tid="+tid+";sid="+sid);
    wx.request({
      url: 'https://test.1zdz.cn/api/room.php',
      method: 'POST',
      data: {
        action: "serch",
        hid: hid,
        zc: zid,
        wid: wid,
        tid: tid,
        sid: sid
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log(res);
        that.setData({
          res_num: res.data.res_num,
          rooms: res.data.rooms,
          show_res: true
        });
      },
      fail: function (res) {
        console.log("查询失败！");
      },
      complete: function (res) {

      }
    });
  },
  /**
   * 显示点击教室当日详细安排
   */
  showDetail: function(e){
    var that = this;
    //获取查询参数
    var rid = e.currentTarget.dataset.roomid;
    var hid = that.data.house[that.data.index_h];
    var zid = parseInt(that.data.index_z) + 1;
    var wid = parseInt(that.data.index_w) + 1;
    wx.request({
      url: 'https://test.1zdz.cn/api/room.php',
      method: 'POST',
      data: {
        action: "detail",
        hid: hid,
        zc: zid,
        wid: wid,
        rid: rid
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log(res);
        if (res.data.detail[0] == "有") var detail_12c = "red"; else var detail_12c = "green";
        if (res.data.detail[1] == "有") var detail_34c = "red"; else var detail_34c = "green";
        if (res.data.detail[2] == "有") var detail_56c = "red"; else var detail_56c = "green";
        if (res.data.detail[3] == "有") var detail_78c = "red"; else var detail_78c = "green";
        if (res.data.detail[4] == "有") var detail_910c = "red"; else var detail_910c = "green";
        that.setData({
          detail_room: rid,
          detail_12: res.data.detail[0],
          detail_12c: detail_12c,
          detail_34: res.data.detail[1],
          detail_34c: detail_34c,
          detail_56: res.data.detail[2],
          detail_56c: detail_56c,
          detail_78: res.data.detail[3],
          detail_78c: detail_78c,
          detail_910: res.data.detail[4],
          detail_910c: detail_910c,
          hidmodal: false
        });
      },
      fail: function (res) {
        console.log("查询失败！");
      },
      complete: function (res) {

      }
    });
  },
  confirm: function () {
    this.setData({
      hidmodal: true
    })
  }
})