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
      message: '确定要删除吗',
    })
      .then(() => {
        // on confirm
        wx.cloud.database().collection("list").where({_id: this.data.item._id}).remove();
        wx.navigateBack();
      })
      .catch(() => {
        // on cancel
      })
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

 
})