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
  async getUserOpenId() {
    wx.login({
      success: (res) => {
        // console.log(res);
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          method: 'GET',
          data: {
            appid: 'wxa09251f5028d3bf0',
            secret: '8c099e637711aac11ca7696b8950532a',
            js_code: res.code,
            grant_type: 'authorization_code',
          },
          success: res => wx.setStorage({ openId: res.data.openid })
        })
      },
    })
  },
     
 async test(){
  //  const res = await this.uploadAvatar()
  //  const url = await this.getAvatarUrl()
  //  this.formatDate()
  const time = new Date()
   console.log(time);
   this.getUserOpenId()
  },


  onUnload() {
    // this.storeBindings.destoryStoreBindings()
  }
})