// import { createStoreBindings } from 'mobx-miniprogram-bindings'
// import { store } from '../../store/store'
// const app = getApp()


Page({
  data:{
    isLogin: true,
    nickname: '',
    avatar: '',
    avatarfileID: '',
  },
  onLoad(options) {
    this.autoLoadUserinfo();
  },
  navToPublish(){
    wx.navigateTo({
      url: '/pages/publish/index',
    });
    console.log("to page/publish")
  },
  autoLoadUserinfo(){
    this.setData({avatar: wx.getStorageSync('avatar'), nickname: wx.getStorageSync('nickname')})
  },
  async onChooseAvatar(e){
    const avatar = e.detail.avatarUrl;
    this.setData({avatar});
    const fileID = await this.uploadAvatar(avatar);
    const url = await this.getAvatarUrl(fileID);
    wx.setStorageSync('avatar', url[0].tempFileURL)
    console.log(url[0].tempFileURL)
  },
  onChangeNickName(e){
    wx.createSelectorQuery()
  .select(".user-nickname")
  .fields({
    properties: ["value"],
  })
  .exec((res) => {
    const nickname = res[0].value;
    // 处理nickname
    wx.setStorageSync('nickname', nickname);
    this.setData({nickname})
    // console.log(wx.getStorageSync('nickname'))
  });
    //  
  },

  // 上传头像并返回头像文件ID
  uploadAvatar(e){
    return new Promise(resolve => {
       wx.cloud.uploadFile({
        cloudPath: 'avatar' + '/' + new Date().toLocaleString() +  '.jpeg',
        filePath: e,
        success: res => {
          // console.log(res)
          resolve(res.fileID)
        }
      })
    })
  },
  // 获取头像下载和访问地址
  getAvatarUrl(avatar){
    return new Promise((resolve, reject) => {
      wx.cloud.getTempFileURL({
        fileList: Array(avatar),
        success: res => {
          // console.log(res)
          resolve(res.fileList)},
        fail: err => reject(err)
      })
    })
  },

 async test(){
   console.log(wx.getStorageSync('avatar'))
  },


  onUnload() {
    // this.storeBindings.destoryStoreBindings()
  }
})