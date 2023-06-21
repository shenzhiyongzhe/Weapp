// pages/edit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id:'',
    title: '',
    rent: '',
    sex: '',
    location: {},
    description: '',
    tempUrl: [],
    list: []
  },
  async formSubmit(e){
    const {title, sex, location, description} = e.detail.value;
    const rent = Number(e.detail.value.rent);
    const url = await this.uploadFile();
    const list = this.data.tempUrl.concat(url);
    wx.cloud.database().collection("list").where({_id: this.data._id}).update({
      data: {
        title, rent, sex, location, description, list
      },
      success: res => {console.log("更新成功", res); wx.navigateBack()}
    })
  },
  afterRead(e){
    const file = e.detail.file;
    const list = file.map((item, index) => {
      return {url: item.url, name: new Date().getTime() + index}
    });
    this.setData({list, tempUrl: this.data.tempUrl.concat(list)});
    // console.log(list)
  },
  uploadImg(item){
    return new Promise(resolve => {
      wx.cloud.uploadFile({
        cloudPath: new Date().toLocaleString() + '_'+ item.name + '.jpg',
        filePath: item.url,
        success: res => resolve(res.fileID)
      })
    })
   },
     //根据fileID获取照片URL
  getTempUrl(list){
    return new Promise((resolve, reject) => {
      wx.cloud.getTempFileURL({
        fileList: list,
        success: res => {
          const fileList = Array.from(res.fileList, ({tempFileURL}) => tempFileURL)
          resolve(fileList)
        },
        fail: err => reject(err)
      })
    })
  },
     //上传所有照片并返回URL
  async uploadFile() {
    let list = [];  
    for(const item of this.data.list){
      list.push(await this.uploadImg(item));
    }
    // 查询照片访问地址
    return await this.getTempUrl(list)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const detail = JSON.parse(decodeURIComponent( options.detail));
    const {_id, title, rent, sex, location, list, description} = detail;
    this.setData({_id, title, rent, sex, location, description, tempUrl: list});
    console.log("options.detail", detail)
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