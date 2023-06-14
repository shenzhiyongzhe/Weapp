
// pages/publish/index.js
const db = wx.cloud.database().collection('list');
const _ = wx.cloud.database().command;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexList: ['不限', '男生', '女生'],
    location:{},
    description:'',
    tempUrl: [], //临时照片
    maxUpload: true,
    cloudFile: ['1','2'],
    publish:{},
    show: false,  //弹框输入

    columns: ['不限', '男生', '女生' ],
  },

  // 选择性别限制
  chooseSex(e){
    this.setData({sex: this.data.sexList[e.detail.value]});
  },
  // 选择位置
  chooseLocation(){
    wx.chooseLocation({
      success: res => {
        const {errMsg, ...location} = res
        this.setData({location});
      }
    })
  },

  //选择照片
  chooseImg(){
    const url = this.data.tempUrl;
    if(url.length >= 4) this.setData({maxUpload: false});
    else{
      wx.chooseMedia({
      count: 4 - url.length,
      mediaType: ['image'],
      success: res => {
        const list = res.tempFiles.map( item => item.tempFilePath)
        this.setData({tempUrl: [...url, ...list]});
        }
      })  
    }
  },
  //单张照片上传
  singleImgUpload({index = 0, url}){
    return new Promise( resolve => {
      wx.cloud.uploadFile({
        cloudPath: new Date().toLocaleString() + '_'+ index + '.jpg',
        filePath: url,
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
    for(const [ index, url ] of this.data.tempUrl.entries())
      list.push(await this.singleImgUpload({index, url}));
    // 查询照片访问地址
    return await this.getTempUrl(list)
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
    const list = await this.uploadFile()
    const avatar = wx.getStorageSync('avatar');
    const nickname = wx.getStorageSync('nickname');
    const location = this.data.location;
    const time = new Date().getTime();
    const {title, sex, description} = e.detail.value;
    const rent = Number(e.detail.value.rent)
    db.add({
      data: {title, sex, description, rent, list, time, location, userInfo: {nickname, avatar}, message: []},
      success: res => {
        wx.hideLoading();
        console.log("post success!", res)
        
      }
    })
  },
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