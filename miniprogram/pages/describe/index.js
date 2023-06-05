// pages/describe/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    description: ''
  },

  textConfirm(e){
    this.setData({description: e.detail.value})
    // console.log(e)
  },
  backToPagePublish(){
    wx.createSelectorQuery().select('.content').fields([{properties: ['value']}]).exec(res => console.log(res))
    const pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    const prePage = pages[pages.length - 2];
    prePage.setData({description: this.data.description}); 
    wx.navigateBack({delta: 1})
    // console.log(e)
  },
test(){
  console.log('hello')

},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({description: options.description})
    // console.log("", options)
  },
  onLanuch(){


  }
})