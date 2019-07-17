// pages/setting-detail/set-serer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // radioItems: [
    //   { name: '服务器1：210.30.62.37', value: '210.30.62.37', state:"",checked: true },
    //   { name: '服务器2：210.30.62.38', value: '210.30.62.38', state: "" },
    //   { name: '服务器3：210.30.62.39', value: '210.30.62.39', state: "" },
    //   { name: '服务器4：210.30.62.40', value: '210.30.62.40', state: "" }
    // ],
    redioItems:[]
  },
  radioChange: function (e) {
    var that = this;
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems
    });
    wx.setStorageSync("myserver", e.detail.value);
    // wx.setStorage({
    //   key: 'server',
    //   data: e.detail.value,
    // });
    console.log("存server:" + e.detail.value);
    wx.showToast({
      title: '更换成功！',
      duration: 1000
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://test.1zdz.cn/api/getserver.php',
      method: 'GET',
      success: function (res) {
        console.log(res);
        let myserver = wx.getStorageSync("myserver");
        console.log(myserver);
        // wx.setStorageSync("myserver", res.data.server);
        // wx.setStorageSync("myserverindex", res.data.index);
        let servers = new Array();
        for(let i=0;i<res.data.all.length;i++){
          let sitem = new Object();
          sitem['name'] = res.data.all[i].name;
          sitem['value'] = res.data.all[i].server;
          sitem['state'] = res.data.all[i].state;
          myserver == res.data.all[i].server ? sitem['checked'] = true : sitem['checked'] = false;
          servers[i] = sitem;
        }
        that.setData({
          radioItems: servers
        });
      }
    })

    // var radioItems = that.data.radioItems;
    // wx.getStorage({
    //   key: 'server', success: function (res) { 
    //     if (res.data == null) {
    //       radioItems[0].checked = true;
    //       wx.setStorage({
    //         key: 'server',
    //         data: "210.30.62.37",
    //       });
    //     } else {
    //       for (var i = 0; i < 4; i++) {
    //         if (res.data == that.data.radioItems[i].value) {
    //           radioItems[i].checked = radioItems[i].value == res.data;
    //         }
    //         else radioItems[i].checked = false;
    //       }
    //     }
    //     that.setData({ radioItems: radioItems }); 
    //   },
    //   fail: function(){
    //     var radioItems = that.data.radioItems;
    //     radioItems[0].checked = true;
    //     wx.setStorage({
    //       key: 'server',
    //       data: "210.30.62.37",
    //     });
    //     that.setData({ radioItems: radioItems }); 
    //     return;
    //   }
    // });
    // wx.request({
    //   url: 'https://test.1zdz.cn/kcb/getstate.php',
    //   success: function(res){
    //     for (var i = 0; i < 4; i++) {
    //       radioItems[i].state = res.data[i];
    //     }
    //     that.setData({ radioItems: radioItems }); 
    //   }
    // })
    // console.log(radioItems);
    // console.log(that.data.radioItems);
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

  }
})