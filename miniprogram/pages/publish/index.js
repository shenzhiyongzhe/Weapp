
// pages/publish/index.js
const db = wx.cloud.database().collection('list');
const _ = wx.cloud.database().command;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location:{},
    sex: '',
    discription:'',
    fileList: [], //临时照片
    cloudFile: ['1','2'],
    publish:{},
    show: false,  //弹框输入

    columns: ['不限', '男生', '女生' ],
  },

// 选择位置
  chooseLocation(){
    wx.chooseLocation({
      success: res => {
        const {name, address} = res
        this.setData({location: {name, address}})
      }
    })
    },

  // 选择性别限制
  popupPicker(){
    this.setData({
      show: true,
    });
  },
  popupCancel(){
    this.setData({
      show: false,
    });
  },
  popupConfirm(e){
    this.setData({
      show: false,
      sex: e.detail.value
    });
    // console.log(this.data.sex)
  },

  

  selectPhotoes(event) {
    let list = this.data.fileList;
    event.detail.file.forEach((item, index) => list.push({url:item.url, name: index, deletable: true}))
    this.setData({fileList: list})
    // console.log(event.detail)
  },
  uploadPhotes(i){
    return new Promise((resolve)=> {
      wx.cloud.uploadFile({
        cloudPath: Date.now() + '_'+ 1 + '.jpg',
        filePath: this.data.fileList[i].url,
        success: res => resolve(res.fileID)
    })
    })
    
  },
  test(){
 
  },
  async uploadFile() {
    let list = []
    for(let i = 0; i < this.data.fileList.length; i++){
      let j = await this.uploadPhotes(i)
      list.unshift(j)
    };  
    return list
  },
  // 查询照片访问地址
  getTempUrl(list){
    return new Promise((resolve, reject) => {
      wx.cloud.getTempFileURL({
        fileList: list,
        success: res => {
          const fileList = Array.from(res.fileList, ({tempFileURL}) => tempFileURL)
          resolve(fileList)},
        fail: err => reject(err)
      })
    })
  },
  poster(publish){
    return new Promise(resolve => {
      db.add({
        data: publish,
        success: res => resolve(res)
      })
    })

  },
  async formSubmit(e){
    wx.showLoading({
      title: '上传中...',
    });
    const {
      title,
      charge,
      description
    } = e.detail.value;
    const location = this.data.location;
    const sex = this.data.sex;
    const list = await this.uploadFile()
    const fileList = await this.getTempUrl(list)
    const userinfo = app.globalData.userinfo
    console.log('list',fileList)
    const publish = {userinfo, title, charge, location, sex, description, fileList};
    await this.poster(publish);
    wx.hideLoading();
    console.log("post success!")
  },
// 上传照片的函数

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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