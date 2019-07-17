//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });

    //初次使用获取服务器
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
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

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
    server: null
  },
  //请求分配服务器
getServer: function(){
  let data = new Object();
  wx.request({
    url: 'https://test.1zdz.cn/api/getserver.php',
    method: 'GET',
    success: function(res){
      console.log(res);
      
    }
  })
},

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