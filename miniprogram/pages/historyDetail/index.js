import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({
  data: {
    item: {},
    marker: [],
  },
  navToEdit(e){
    wx.navigateTo({
      url: `/pages/edit/index?detail=${encodeURIComponent(JSON.stringify(e.currentTarget.dataset.detail))}`,
    });
    // console.log("navi to edit", e.currentTarget.dataset.detail)
  },
  delete(){
    Dialog.confirm({
      title: '1',
      message: '确定要删除吗',
    })
      .then(() => {
        // on confirm
      })
      .catch(() => {
        // on cancel
      })
    // wx.cloud.database().collection("list").where({_id: this.data.item._id}).remove()
  },

  onLoad(options) {
    const item = JSON.parse(decodeURIComponent(options.item))
    this.setData({
      item, 
      marker: [{      
        id: 0,
        height: '40',
        width: '25',
        longitude: item.location.longitude,
        latitude: item.location.latitude,
        iconPath: '../../img/position.png'
      }]
    });
    // console.log(item)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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