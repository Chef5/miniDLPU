// components/jun-modal/jun-modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 标题
    title: String,
    // 是否显示modal
    show: {
      type: Boolean,
      value: false
    },
    // 标题颜色
    titleColor: {
      type: String,
      value: "black"
    },
    // 内容颜色
    contentColor: {
      type: String,
      value: "black"
    },
    // 视图高度
    height: {
      type: String,
      value: "auto"
    },
    // 是否显示取消按钮
    noCancel: {
      type: Boolean,
      value: false
    },
    // 取消按钮文字
    cancelText: {
      type: String,
      value: "取消"
    },
    // 取消按钮颜色
    cancelColor: {
      type: String,
      value: "rgba(0,0,0,0.73)"
    },
    // 是否显示确认按钮
    noConfirm: {
      type: Boolean,
      value: false
    },
    // 确定按钮文字
    confirmText: {
      type: String,
      value: "确定"
    },
    // 确定按钮颜色
    confirmColor: {
      type: String,
      value: "#1298CF"
    }
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel() {
      this.setData({ show: false })
      this.triggerEvent('cancel')
    },

    confirm() {
      this.setData({ show: false })
      this.triggerEvent('confirm')
    }
  }
})
