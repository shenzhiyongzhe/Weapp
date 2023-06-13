
const db = wx.cloud.database();

Page({
  data:{
    isLogin: true,
    avatar: '',
    nickname: '',
    avatarfileID: '',
  },
  onLoad(options) {
    const avatar = wx.getStorageSync('avatar');
    const nickname = wx.getStorageSync('nickname');
    if(avatar && nickname)
      this.setData({avatar: wx.getStorageSync('avatar'), nickname: wx.getStorageSync('nickname')})
  },
  navToPublish(){
    const {avatar, nickname} = this.data;
    if(avatar && nickname)
      wx.navigateTo({
        url: '/pages/publish/index',
      });
    else if(avatar)
      wx.showToast({
        title: '请输入一个昵称',
        icon: 'none'
      })
    else
      wx.showToast({
        title: '请选择一个头像',
        icon: 'none'
      })
  },
  async navToPosted(){
    if(wx.getStorageSync('openid'))
      wx.navigateTo({
          url: '/pages/posted/index',
        })
    else{
      const openid = await this.getUserOpenId();
      wx.setStorageSync('openid', openid);
      wx.navigateTo({
        url: `/pages/posted/index?openid=${openid}`,
      })
    }
  
  },
  async onChooseAvatar(e){
    const avatar = e.detail.avatarUrl;
    this.setData({avatar});
    const fileID = await this.uploadAvatar(avatar);
    const url = await this.getAvatarUrl(fileID);
    wx.setStorageSync('avatar', url[0].tempFileURL)
  },
  onChangeNickName(e){
    wx.createSelectorQuery()
    .select(".user-nickname")
    .fields({
      properties: ["value"],
    })
    .exec((res) => {
      const nickname = res[0].value;
      wx.setStorageSync('nickname', nickname);
      this.setData({nickname});
    });
  },

  // 上传头像并返回头像文件ID
  uploadAvatar(e){
    return new Promise(resolve => {
       wx.cloud.uploadFile({
        cloudPath: 'avatar' + '/' + new Date().toLocaleString() +  '.jpeg',
        filePath: e,
        success: res => resolve(res.fileID)
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
    // 获取用户唯一表示和登录认证
    getUserOpenId() {
      return new Promise( resolve => {
        wx.login({
          success: (res) => {
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session',
              method: 'GET',
              data: {
                appid: 'wxa09251f5028d3bf0',
                secret: '8c099e637711aac11ca7696b8950532a',
                js_code: res.code,
                grant_type: 'authorization_code',
              },
              success: res => resolve(res.data.openid)
            })
          },
        })
      })
    },

 async test(){
   console.log(wx.getStorageSync('avatar'))
  },

})