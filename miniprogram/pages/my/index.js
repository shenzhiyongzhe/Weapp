
const db = wx.cloud.database();

Page({
  data:{
    isLogin: true,
    userAvatar: '',
    userNickname: '',
    avatarfileID: '',
  },
  onLoad(options) {
    const userAvatar = wx.getStorageSync('userAvatar');
    const userNickname = wx.getStorageSync('userNickname');
    if(userAvatar && userNickname)
      this.setData({userAvatar: wx.getStorageSync('userAvatar'), userNickname: wx.getStorageSync('userNickname')})
  },
  navToPublish(){
    const {userAvatar, userNickname} = this.data;
    if(userAvatar && userNickname)
      wx.navigateTo({
        url: '/pages/publish/index',
      });
    else if(userAvatar)
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
    const openid = await this.getUserOpenId();
    wx.setStorageSync('openid', openid);
    wx.navigateTo({
        url: `/pages/posted/index?openid=${openid}`,
      })
  
  },
  async onChooseAvatar(e){
    const avatar = e.detail.avatarUrl;
    this.setData({userAvatar: avatar});
    const fileID = await this.uploadAvatar(avatar);
    const url = await this.getAvatarUrl(fileID);
    wx.setStorageSync('userAvatar', url[0].tempFileURL)
    console.log(wx.getStorageSync('userAvatar'))
  },
  onChangeNickName(e){
    wx.createSelectorQuery()
    .select(".user-nickname")
    .fields({
      properties: ["value"],
    })
    .exec((res) => {
      const userNickname = res[0].value;
      wx.setStorageSync('userNickname', userNickname);
      this.setData({userNickname});
      console.log(wx.getStorageInfoSync('userNickname'))
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