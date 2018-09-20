//index.js
//获取应用实例
const app = getApp();
var itemFirstDay;
Page({ 
  data: {
    userid:"",
    userpwd:"",
    server:'210.30.62.37',
    arrayxq: ['2018-2019-1'],
    indexzc: 0,
    arrayzc: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
    tqimgurl:"",
    tqtemp: "--~--", 
    hiddenmodalput: true,
    name:"",
    leader:"",
    room:"",
    time1: "",
    time2: "",
    arrayth: [
      { week: "周一", date: ""}, 
      { week: "周二", date: ""}, 
      { week: "周三", date: ""},
      { week: "周四", date: ""}, 
      { week: "周五", date: ""}],
    arraykcb1 : [
      { name: "", room: "", leader: "", time: "", color: "" },
      { name: "", room: "", leader: "", time: "", color: "" },
      { name: "", room: "", leader: "", time: "", color: "" },
      { name: "", room: "", leader: "", time: "", color: "" },
      { name: "", room: "", leader: "", time: "", color: "" },
    ],
    arraykcb2: [
      { name: "", room: "", leader: "", time: "", color: "" },
      { name: "", room: "", leader: "", time: "", color: "" },
      { name: "", room: "", leader: "", time: "", color: "" },
      { name: "", room: "", leader: "", time: "", color: "" },
      { name: "", room: "", leader: "", time: "", color: "" },
    ],
    arraykcb3: [
      { name: "", room: "", leader: "", time: "", color: "" },
      { name: "", room: "", leader: "", time: "", color: "" },
      { name: "", room: "", leader: "", time: "", color: "" },
      { name: "", room: "", leader: "", time: "", color: "" },
      { name: "", room: "", leader: "", time: "", color: "" },
    ],
    arraykcb4: [
      { name: "", room: "", leader: "", time: "", color: "" },
      { name: "", room: "", leader: "", time: "", color: "" },
      { name: "", room: "", leader: "", time: "", color: "" },
      { name: "", room: "", leader: "", time: "", color: "" },
      { name: "", room: "", leader: "", time: "", color: "" },
    ],
    arraykcb5: [
      { name: "", room: "", leader: "", time: "", color: "" },
      { name: "", room: "", leader: "", time: "", color: "" },
      { name: "", room: "", leader: "", time: "", color: "" },
      { name: "", room: "", leader: "", time: "", color: "" },
      { name: "", room: "", leader: "", time: "", color: "" },
    ],

  },
  zcChange: function (e) {
    var that = this;
    that.setData({
      indexzc: e.detail.value,
    });
    that.reFreshKCB();
  },

  //事件处理函数
  bindViewTap: function() {
  },
  onLoad: function () {
    var that = this;
    wx.getStorage({key: 'userid',success: function(res) {
        that.setData({userid: res.data});},
    });
    wx.getStorage({key: 'userpwd',success: function (res) {
        that.setData({userpwd: res.data});},
    });
    //获取天气
    wx.request({
      url: 'https://test.1zdz.cn/api/getweather.php',
      success: function(res) {
        var tqimgurl = res.data.imgurl;
        var templow = res.data.templow;
        var temphigh = res.data.temphigh;
        var tqtemp = templow + "~" + temphigh;
        that.setData({
          tqimgurl:tqimgurl,
          tqtemp:tqtemp
        });
      },
      fail: function(res) {},
      complete: function(res) {},
    });
    //获取开学和放假日期，计算当前周
    wx.request({
      url: 'https://test.1zdz.cn/kcb/getdate.php',
      success: function (dat) {
        itemFirstDay = dat.data.itemStart;
        //当前学期设置
        that.setData({
          arrayxq: [dat.data.nowItem],
        });
        //当前周次设置
        var nowtime = new Date();  //当前时间
        var nowtimestamp = Date.parse(nowtime);  //当前时间的时间戳（毫秒）最后三位000
        var day = ((nowtimestamp / 1000 - dat.data.itemStart) / 86400); //与开学时间的时间差（天）
        var nowzc = Math.ceil(day / 7); //向上取整
        if (nowzc > 20) nowzc = 20;
        that.setData({
          indexzc: nowzc-1,
        });
        //计算当前选择周1至周5日期
        that.caculateDate(itemFirstDay);
      },
      fail: function (res) {
        
      },
    });
  },
  onReady:function(){
    var that = this;
    that.reFreshKCB();
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    //计算当前选择周1至周5日期
    that.caculateDate(itemFirstDay);
    that.reFreshKCB();
  },
  //计算日期
  caculateDate: function (itemFirstDay) {
    var that = this;
    //计算当前选择周1至周5日期
    var selzc = that.data.arrayzc[that.data.indexzc];
    var everyMonday = (selzc - 1) * 7; //周次x7,获取没周一距离开学那天的天数
    var itemF = new Date(itemFirstDay * 1000);
    var YearY = itemF.getFullYear();
    var MonthM = itemF.getMonth() + 1 < 10 ? '0' + (itemF.getMonth() + 1) : itemF.getMonth() + 1;
    var DayD = itemF.getDate();
    var firstDayTime = new Date(YearY + "/" + MonthM + "/" + DayD + " 00:00:00");  //IOS系统的坑，用‘-’会加载不出来，只能用‘/’
    var firstDayTime = firstDayTime.valueOf();
    var addtoarrayth = that.data.arrayth;
    for (var i = 0; i < 5; i++) {
      var nextDate = new Date(firstDayTime + (everyMonday + i) * 24 * 60 * 60 * 1000); //后一天
      var nextMonth = nextDate.getMonth() + 1 < 10 ? '0' + (nextDate.getMonth() + 1) : nextDate.getMonth() + 1;
      var nextDay = nextDate.getDate() < 10 ? '0' + nextDate.getDate() : nextDate.getDate();
      addtoarrayth[i].date = nextMonth + "." + nextDay;
    }
    that.setData({
      arrayth: addtoarrayth,
    });
  },
  //课程表刷新
  reFreshKCB:function(){
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    //显示等待提示
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 1200
    });
    //刷新本地账号
    wx.getStorage({
      key: 'userid', success: function (res) {
        that.setData({ userid: res.data });
      },
    });
    wx.getStorage({
      key: 'userpwd', success: function (res) {
        that.setData({ userpwd: res.data });
      },
    });
    //计算当前选择周1至周5日期
    that.caculateDate(itemFirstDay);
    var Id = that.data.userid;
    var Pwd = that.data.userpwd;
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
    var Server = that.data.server;
    if (Id == null) {
      return;
    }
    var items = that.data.arrayxq[0];
    var weeks = that.data.arrayzc[that.data.indexzc];
    wx.request({
      url: 'https://test.1zdz.cn/api/kcb.php',
      method: 'POST',
      data: {
        //XiangGanMa: WannaKey,
        id: Id,
        pwd: Pwd,
        item: items,
        week: weeks,
        server: Server
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.state == "error") {
          wx.showModal({
            content: '课程表数据加载失败了，多刷新两次试试！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
                return;
              }
            }
          });
        }
        else {
          var tdcolors = [
            'rgba(72,61,139,0.6)', 'rgba(100,149,237,0.8)', 'rgba(0,139,139,0.6)',
            'rgba(216,191,216,0.9)', 'rgba(106,96,205,0.5)', 'rgba(240,128,128,0.6)',
            'rgba(210,180,140,0.7)', 'rgba(144,238,144,0.9)', 'rgba(255,165,0,0.4)',
            'rgba(0,206,209,0.5)'
          ];
          //对同一科目进行标号
          var index = 1;
          for (var hang = 0; hang < 6; hang++) {
            for (var i = 0; i < 5; i++) {
              if (res.data[hang][i].name != "" && res.data[hang][i].index == "") {
                var tmp_name = res.data[hang][i].name;
                for (var h = hang; h < 6; h++) {//向下搜寻相同课程，名称
                  for (var j = 0; j < 5; j++) {
                    if (res.data[h][j].name == tmp_name && res.data[h][j].index == "") {
                      res.data[h][j].index = index;//标号
                    }
                  }
                }
                index++;
              }
            }
          }
          for (var hang = 0; hang < 5; hang++) {
            if (hang == 0) var changeKCB = that.data.arraykcb1;
            if (hang == 1) var changeKCB = that.data.arraykcb2;
            if (hang == 2) var changeKCB = that.data.arraykcb3;
            if (hang == 3) var changeKCB = that.data.arraykcb4;
            if (hang == 4) var changeKCB = that.data.arraykcb5;
            for (var i = 0; i < 5; i++) {
              changeKCB[i].name = that.isOver15(res.data[hang][i].name);
              changeKCB[i].room = res.data[hang][i].room;
              changeKCB[i].leader = res.data[hang][i].leader;
              changeKCB[i].color = tdcolors[res.data[hang][i].index - 1];
            }
            //console.log(changeKCB);
            if (hang == 0) { that.setData({ arraykcb1: changeKCB, }); };
            if (hang == 1) { that.setData({ arraykcb2: changeKCB, }); };
            if (hang == 2) { that.setData({ arraykcb3: changeKCB, }); };
            if (hang == 3) { that.setData({ arraykcb4: changeKCB, }); };
            if (hang == 4) { that.setData({ arraykcb5: changeKCB, }); };

          }
          //
        }
      },
      fail: function (res) {
        console.log("获取课程表失败！");
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
  onShow:function(){
    var that = this;
    //刷新本地账号
    wx.getStorage({
      key: 'userid', success: function (res) {
        that.setData({ userid: res.data });
      },
    });
    wx.getStorage({
      key: 'userpwd', success: function (res) {
        that.setData({ userpwd: res.data });
      },
    });
  },
  //判断课程字数是否超出小方块
  isOver15:function(str) {
  if (str.length > 15) {
    return str.substring(0, 14) + "...";
  }
    else return str;
  },
  showdetail:function(e){
     console.log(e);
    var that = this;
    var noshow = false;
    var gname = e.currentTarget.dataset.name;
    var groom = e.currentTarget.dataset.room;
    var gleader = e.currentTarget.dataset.leader;
    var gtime1 = e.currentTarget.dataset.time1;
    var gtime2 = e.currentTarget.dataset.time2;
    // var showstr = leader+'\r\n'+time;
    // wx.showModal({
    //   title:'课程详细：',
    //   content: showstr,
    //   showCancel: false,
    //   success: function (res) {
    //     if (res.confirm) {
    //     }
    //   }
    // });
    if (gname == "" || groom == "" || gleader == "" || gtime1 == "" || gtime2 == "")noshow = true;
    that.setData({
      hiddenmodalput: noshow,
      name:gname,
      room:groom,
      leader:gleader,
      time1: gtime1,
      time2: gtime2,
    })
  },
  confirm: function () {
    this.setData({
      hiddenmodalput: true
    })
  }
})
