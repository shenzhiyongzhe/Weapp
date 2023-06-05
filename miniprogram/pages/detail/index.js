// pages/detail/index.js
// const content = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:'',
    iconPath: '',
    marker: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const detail = JSON.parse(decodeURIComponent( options.detail))
    this.setData({
      detail: detail, 
      marker: [{      
        id: 0,
        height: '40',
        width: '25',
        longitude: detail.location.longitude,
        latitude: detail.location.latitude,
        iconPath: '../../img/position.png'
      }]
    })
    console.log(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // console.log(content)

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})