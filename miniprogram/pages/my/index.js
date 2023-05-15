// import { createStoreBindings } from 'mobx-miniprogram-bindings'
// import { store } from '../../store/store'
const app = getApp()

Page({
  data:{
    isLogin: true,
    userinfo: app.globalData.userinfo
  },
  onLoad(options) {
    // this.storeBindings = createStoreBindings(this, {
    //   store,
    //   fields: ['userinfo'],
    //   actions: ['updateNum']
    // })
  },
  navToPublish(){
    wx.navigateTo({
      url: '/pages/publish/index',
    });
    console.log("to page/publish")
  },
  onChooseAvatar(e){
    console.log("choose avatar", app.globalData.userinfo);
    app.globalData.userinfo.avatar = e.detail.avatarUrl
    this.setData({'userinfo.avatar': e.detail.avatarUrl})
  },
  reviseNickName(e){
    this.setData({'userinfo.nickname': e.detail.value})
    app.globalData.userinfo.nickname = e.detail.value;
    console.log(app.globalData.userinfo)
  },
  uploadAvatar(){
    return new Promise(resolve => {
       wx.cloud.uploadFile({
        cloudPath: 'avatar' + '/' + Date.now() + '_'+ 1 + '.jpeg',
        filePath: "http://tmp/r7AG8EH3TtHxed2a560a40c756ea16f383ecb7402b38.jpeg",
      success: res => resolve(res.fileID)
    })
  })
  },
  getAvatarUrl(){
    return new Promise((resolve, reject) => {
      wx.cloud.getTempFileURL({
        fileList: [this.data.userinfo.avatar],
        success: res => {
          const fileList = Array.from(res.fileList, ({tempFileURL}) => tempFileURL)
          resolve(fileList)},
        fail: err => reject(err)
      })
    })
  },
 async test(){
   const res = await this.uploadAvatar()
   const url = await this.getAvatarUrl()
   console.log(Date.now(), res, url);
  },


  onUnload() {
    // this.storeBindings.destoryStoreBindings()
  }
})