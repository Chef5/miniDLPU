// pages/setting-userinfo/set-userinfo.js//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid:'',
    userpwd:'',
    hidpwd:'',
    updatetime: '0000-00-00 00:00:00',
    theme: app.globalData.theme, //主题
  },
  getuserid: function(e){
    var userid = e.detail.value;
    this.setData({
      userid: userid
    })
  }, 
  getuserpwd: function (e) {
    var userpwd = e.detail.value;
    this.setData({
      userpwd: userpwd
    })
  },
  //课程表数据抓取
  storeKcb: function(){
    var that = this;
    var userid = that.data.userid;
    var userpwd = encodeURIComponent(that.data.userpwd);//转义，防止有特殊字符如：&
    //console.log(userid+userpwd);
    if(userid.length != 10){
      wx.showModal({
        title: '学号错误',
        showCancel: false,
        content: userid.length === 14 ? '暂不支持研究生账号' : `学号位数不对！当前位数：${userid.length}`,
        confirmColor: that.data.theme.color[that.data.theme.themeColorId].value
      })
    }else{
      //0 验证失败， 1密码正确， 2密码错误， 3服务器被ban
      app.checkUser(userid, userpwd).then(res => {
        console.log(res);
        if (res.data.code == 200) {
          if (res.data.name) { //密码正确
            wx.showToast({
              title: '欢迎' + res.data.name,
            });
            wx.showLoading({
              title: '玩命抓取中...',
              mask: true
            })
            that.saveUserinfo(that.data.userid, that.data.userpwd);
            var WannaKey = app.encryptUserKey(userid, userpwd);
            var reurl = wx.getStorageSync('myserver');
            // var reurl = "https://test.1zdz.cn";
            console.log(reurl);
            wx.request({
              // url: 'http://www.api.jun/test.php',
              url: reurl+'/api/grap.php',
              method: 'POST',
              data: {
                XiangGanMa: WannaKey
              },
              header: { "Content-Type": "application/x-www-form-urlencoded" },
              success: function (res) {
                console.log(res);
                wx.hideLoading();
                if (res.data.code == 100) {
                  wx.setStorage({
                    key: 'localDataKcb',
                    data: res.data,
                    success: function () {
                      wx.setStorageSync('kcbaction', 'static');
                      wx.showToast({
                        title: '抓取完成',
                        icon: 'success',
                        duration: 1000,
                        complete: function () {
                          wx.showModal({
                            title: '抓取完成',
                            content: '课程表数据获取完成，现在可以返回课程表页面下拉刷新课表了。',
                            confirmText: "立即前往",
                            cancelText: "留下",
                            confirmColor: that.data.theme.color[that.data.theme.themeColorId].value,
                            success: function (res) {
                              if (res.confirm) {
                                wx.reLaunch({
                                  url: '../kcb/kcb',
                                })
                              } else {
                                console.log('用户想了想')
                              }
                            }
                          });
                        }
                      });
                      that.setData({ updatetime: res.data.time });
                      wx.setStorageSync('updatetime', res.data.time);
                    },
                    fail: function () {
                      wx.setStorageSync('kcbaction', 'dym');
                      wx.showModal({
                        title: '保存出错',
                        showCancel: false,
                        content: '数据已获取，但保存失败，请告知开发者手机型号',
                        confirmColor: that.data.theme.color[that.data.theme.themeColorId].value
                      })
                    }
                  })
                } else {
                  wx.setStorageSync('kcbaction', 'dym');
                  wx.showModal({
                    title: '抓取出错',
                    showCancel: true,
                    content: '非常抱歉地通知您，可能现在服务器有点忙哦，您可以在设置里切换服务器试试，也可以打开实时课表试试喔！',
                    confirmText: '知道啦',
                    cancelText: '打开实时',
                    confirmColor: that.data.theme.color[that.data.theme.themeColorId].value,
                    success: function(res){
                      if(res.cancel){
                        wx.setStorageSync('kcbaction', 'dym');
                      }
                    }
                  })
                }
              },
              fail: function (res) {
                wx.hideLoading();
                wx.setStorageSync('kcbaction', 'dym');
                wx.showModal({
                  title: 'Error',
                  showCancel: false,
                  content: '网络错误',
                  confirmColor: that.data.theme.color[that.data.theme.themeColorId].value
                })
              },
              complete: function (res) {
                wx.hideLoading();
              }
            });
          } // end of 密码正确
          else {  //  密码错误
            wx.showModal({
              title: '学号或密码错误',
              showCancel: false,
                content: '学号或者密码不正确，请检查后再尝试。可浏览器登录 http://jiaowu.dlpu.edu.cn 进行自我检查。[Error:' + res.data.code + ']',
              confirmColor: that.data.theme.color[that.data.theme.themeColorId].value
            })
          }  //end of 密码错误
        } else {  //服务器被ban 
            if (res.data.code == 403) {
                wx.showModal({
                    title: '请切换服务器',
                    content: '很遗憾，当前服务器暂时被ban，请切换服务器 [Error:' + res.data.code + ']',
                    showCancel: true,
                    confirmText: "立即切换",
                    confirmColor: that.data.theme.color[that.data.theme.themeColorId].value,
                    success: function(res) {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: '../setting-detail/set-server',
                            })
                        }
                    }
                });
            } else {
                wx.showModal({
                    title: '服务器故障',
                    content: '很遗憾，当前服务器暂时不可用，请通知管理员处理 [Error:' + res.statusCode + ']',
                    showCancel: true,
                    confirmText: "立即切换",
                    confirmColor: that.data.theme.color[that.data.theme.themeColorId].value,
                    success: function (res) {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: '../setting-detail/set-server',
                            })
                        }
                    }
                });
            }
        }   //end of 服务器被ban
      }).catch((res) => { //验证失败
        wx.hideLoading();
        wx.showModal({
          title: '账号检查失败',
          content: '请检查手机网络，或当前服务器暂时不可用，或在非高峰期再尝试 [Error:' + statusCode + ']',
          showCancel: true,
          confirmText: "立即切换",
          confirmColor: that.data.theme.color[that.data.theme.themeColorId].value,
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../setting-detail/set-server',
              })
            }
          }
        });
      });  // end of 验证失败
    } // end of if userid
  },
  //更改账号
  storeUser: function(){
    var that = this; 
    var userid = that.data.userid;
    var userpwd = encodeURIComponent(that.data.userpwd);//转义，防止有特殊字符如：&
    //console.log(userid+userpwd);
    if (userid.length != 10) {
      wx.showModal({
        title: '学号错误',
        showCancel: false,
        content: userid.length === 14 ? '暂不支持研究生账号' : `学号位数不对！当前位数：${userid.length}`,
        confirmColor: that.data.theme.color[that.data.theme.themeColorId].value
      })
      return;
    }
    if (!userpwd) {
      wx.showModal({
        title: '密码未设置',
        showCancel: false,
        content: '密码不能为空，请检查',
        confirmColor: that.data.theme.color[that.data.theme.themeColorId].value
      })
      return;
    }
    that.saveUserinfo(that.data.userid, that.data.userpwd);
    wx.setStorageSync('kcbaction', 'dym');
    wx.showModal({
      title: '保存成功！',
      content: '学号和密码已保存至微信缓存，立即返回首页？',
      confirmText: "到首页",
      cancelText: "留下来", 
      confirmColor: that.data.theme.color[that.data.theme.themeColorId].value,
      success: function (res) {
        if (res.confirm) {
          wx.reLaunch({
            url: '../kcb/kcb',
          })
        } else {
          console.log('用户想了想')
        }
      }
    });
  },

  saveUserinfo:function(userid,userpwd){
    var that = this;
    if (userid != '') {
      wx.setStorage({
        key: 'userid',
        data: userid,
      });
      wx.setStorage({
        key: 'userpwd',
        data: userpwd,
      });
      var hidpwd = that.hiddesome(userpwd);
      that.setData({ hidpwd: hidpwd, });
      console.log('userid:' + userid);
      console.log('userpwd:' + userpwd);
    }else{
      wx.setStorage({
        key: 'userid',
        data: '',
      });
      wx.setStorage({
        key: 'userpwd',
        data: '',
      });
      that.setData({ hidpwd: "无", });
    }
    // wx.showToast({
    //   title: '保存成功！',
    //   duration: 1000
    // });
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this; 
    //主题更新
    that.setData({
      theme: app.getTheme()
    });

    wx.getStorage({
      key: 'userid',success: function(res){that.setData({userid: res.data, });},
    });
    wx.getStorage({
      key: 'userpwd', success: function (res) { 
        that.setData({ userpwd: res.data, });
        if (res.data == null || res.data == ''){ that.setData({ hidpwd: '无', });}
        else {
          var hidpwd = that.hiddesome(res.data); that.setData({ hidpwd: hidpwd, });
        }
        },fail(){
          that.setData({ hidpwd: '无', });
        }
    });
    var uptime = wx.getStorageSync('updatetime');
    if(uptime!=''&&uptime!=undefined&&uptime!=null)that.setData({ updatetime: uptime});
    else that.setData({ updatetime: '暂无' });
    
  },
  //判断课程字数是否超出小方块
  hiddesome: function (str) {
    var str1 = str.substring(0, 2);
    var str2 = "";
    for (var i = 0; i < str.length - 3; i++)str2+="*";
    var str3 = str.substring(str.length - 1, str.length);
    return str1+str2+str3;
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
    let that = this;
    //主题更新
    that.setData({
      theme: app.getTheme()
    });
  },
})