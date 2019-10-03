//app.js
App({
  onLaunch: function () {
    //设置主题
    this.globalData.theme = this.getTheme();
    //自动分配获取服务器
    let myserver = wx.getStorageSync("myserver");
    let myserverindex = wx.getStorageSync("myserverindex");
    wx.request({
      url: 'https://test.1zdz.cn/api/getserver.php',
      method: 'GET',
      success: function (res) {
        // console.log(res); 
        if (myserver == null || myserver == undefined || myserver == '') {
          wx.setStorageSync("myserver", res.data.server);
          wx.setStorageSync("myserverindex", res.data.index);
        } else {
          if (myserverindex != res.data.index) {
            wx.setStorageSync("myserver", res.data.server);
            wx.setStorageSync("myserverindex", res.data.index);
          }
        }
      }
    })

    //每日初始化使用次数
    this.refreshCount();

    //强制更新
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      updateManager.applyUpdate();
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
  },
  globalData: {
    userInfo: null,
    server: null,
    countInit: 30,   //每日初始次数
    countIncreseFre: 3600,    //每隔3600s 调整
    countIncreseByTime: 10,   //根据时间 +10
    countIncreseByAD: 20,     //看广告 +20
    theme: {
      image: null,
      themeColorId: 0,
      color: [
        {
          cn: "默认蓝",
          name: "theme-color-default",
          value: "#1298CF",
          font: "theme-color-default-font",
          border: "theme-color-default-border"
        },
        {
          cn: "",
          name: "theme-color-pink",
          value: "#FFC0CB",
          font: "theme-color-pink-font",
          border: "theme-color-pink-border"
        },
        {
          cn: "",
          name: "theme-color-green",
          value: "#83B582",
          font: "theme-color-green-font",
          border: "theme-color-green-border"
        },
        {
          cn: "",
          name: "theme-color-c1",
          value: "#76DBD1",
          font: "theme-color-c1-font",
          border: "theme-color-c1-border"
        },
        {
          cn: "",
          name: "theme-color-c2",
          value: "#CAADDE",
          font: "theme-color-c2-font",
          border: "theme-color-c2-border"
        },
        {
          cn: "",
          name: "theme-color-c3",
          value: "#FF847C",
          font: "theme-color-c3-font",
          border: "theme-color-c3-border"
        },
        {
          cn: "",
          name: "theme-color-c4",
          value: "#769FCD",
          font: "theme-color-c4-font",
          border: "theme-color-c4-border"
        },
        {
          cn: "",
          name: "theme-color-c5",
          value: "#DD6892",
          font: "theme-color-c5-font",
          border: "theme-color-c5-border"
        },
        {
          cn: "",
          name: "theme-color-c6",
          value: "#FA5477",
          font: "theme-color-c6-font",
          border: "theme-color-c6-border"
        },
        {
          cn: "",
          name: "theme-color-c7",
          value: "#48466D",
          font: "theme-color-c7-font",
          border: "theme-color-c7-border"
        }
      ]
    }
  },
  //获取主题配置
  getTheme(){
    let that = this;
    let themeColorId = wx.getStorageSync("ThemeColorId");
    let themeImage = wx.getStorageSync("ThemeImage");
    if (themeColorId){
      this.globalData.theme.themeColorId = themeColorId;
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: that.globalData.theme.color[themeColorId].value,
      })
      wx.setTabBarStyle({
        backgroundColor: that.globalData.theme.color[themeColorId].value,
      })
    }else{
      this.globalData.theme.themeColorId = 0;
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: that.globalData.theme.color[0].value,
      })
      wx.setTabBarStyle({
        backgroundColor: that.globalData.theme.color[0].value,
      })
    }
    if(themeImage != null){
      that.globalData.theme.image = themeImage;
    }
    return this.globalData.theme;
  },
  //验证学号密码是否正确
  checkUser(userid, userpwd) {
    var reurl = wx.getStorageSync('myserver');
    let WannaKey = this.encryptUserKey(userid, userpwd);
    let flag = 0;  //0 验证失败， 1密码正确， 2密码错误， 3服务器错误
    return new Promise(function (resolve, reject) {
      wx.request({
        url: reurl + '/api/checkUser.php',
        // url: 'http://www.api.jun/checkUser.php',
        method: 'POST',
        data: {
          XiangGanMa: WannaKey
        },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {
          resolve(res);
        },
        fail: function () {
          console.log("验证失败");
          reject({flag : 0});
        }
      });
    })
  },
  //刷新次数
  refreshCount: function () {
    let that = this;
    let date = new Date();
    let endtime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
    wx.getStorage({
      key: 'theEverydayUpdateTime',
      success: function (res) {
        // console.log(res.data);
        if (
          res.data.getFullYear() == endtime.getFullYear() &&
          res.data.getMonth() == endtime.getMonth() &&
          res.data.getDate() == endtime.getDate()
        ) {
          // console.log("现在时间：" + date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
          // console.log("存储时间：" + res.data.getFullYear() + "-" + res.data.getMonth() + "-" + res.data.getDate() + " " + res.data.getHours() + ":" + res.data.getMinutes() + ":" + res.data.getSeconds());
          let c = Math.floor((date.getTime() - res.data.getTime()) / 1000 / that.globalData.countIncreseFre);
          // console.log("c " + c);
          wx.getStorage({
            key: 'theEverydayCount',
            success: function (res) {
              console.log("success");
              if (/^\d+$/.test(res.data)) {
                if (c > 0) {
                  console.log("次数更新，c="+c);
                  wx.setStorageSync("theEverydayCount", res.data + c*that.globalData.countIncreseByTime);
                  wx.setStorageSync("theEverydayUpdateTime", date);
                }
              } else {
                console.log("次数异常，已重置");
                that.resetCount();
              }
            },
            fail: function (res) {
              console.log("参数出错，已重置");
              that.resetCount();
            }
          });
        } else {
          console.log("次数过期，已重置");
          that.resetCount();
        }
      },
      fail: function (res) {
        console.log("第一次加载使用次数");
        that.resetCount();
      }
    })
  },
  //消费次数
  delCount: function () {
    if (parseInt(wx.getStorageSync("theEverydayCount")) - parseInt(wx.getStorageSync("theEverydayUsed")) >0){
      wx.setStorageSync("theEverydayUsed", parseInt(wx.getStorageSync("theEverydayUsed")) + 1);
      return true;
    }else{
      return false;
    }
  },
  //次数重置
  resetCount: function () {
    let date = new Date();
    wx.setStorageSync("theEverydayCount", this.globalData.countInit);
    wx.setStorageSync("theEverydayUsed", 0);
    wx.setStorageSync("theEverydayUpdateTime", date);
  },
  //加密处理
  encryptUserKey: function (Id, Pwd){
    var Pwdl1 = Math.floor(Pwd.length / 2);
    var Pwdl2 = Pwd.length - Pwdl1;
    var Pwd1 = Pwd.substr(0, Pwdl1);
    var Pwd2 = Pwd.substr(Pwdl1, Pwdl2);
    var WannaKey = ((parseInt(Id) + 17323) * 3) + "18940291284Jkn2mK5jN,?jb6w520er12" + Pwd1 + "mlYu81sn.*h0koat520" + Pwd2 + "kJKS1423UnJihiv13JHG123nkKH4bIyiuvmUYFGY1998";
    WannaKey = this.base64_encode(WannaKey);
    return WannaKey;
  },
  base64_encode: function(str){ 
    var c1, c2, c3;
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var i = 0, len = str.length, strin = '';
    while(i <len) {
      c1 = str.charCodeAt(i++) & 0xff;
      if (i == len) {
        strin += base64EncodeChars.charAt(c1 >> 2);
        strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
        strin += "==";
        break;
      }
      c2 = str.charCodeAt(i++);
      if (i == len) {
        strin += base64EncodeChars.charAt(c1 >> 2);
        strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
        strin += "=";
        break;
      }
      c3 = str.charCodeAt(i++);
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
      strin += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return strin;
  },
  base64_decode: function(input) {
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = base64EncodeChars.indexOf(input.charAt(i++));
      enc2 = base64EncodeChars.indexOf(input.charAt(i++));
      enc3 = base64EncodeChars.indexOf(input.charAt(i++));
      enc4 = base64EncodeChars.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    return utf8_decode(output);
  }
})