const db = wx.cloud.database().collection('list');
const _ = wx.cloud.database().command;
const app = getApp();
Page({
  data: {
    sexList: ['不限', '男生', '女生'],
    location:{},
    description:'',
    tempUrl: [], //临时照片
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
afterRead(e){
  const file = e.detail.file;
  const list = file.map((item, index) => {
    return {url: item.url, name: new Date().getTime() + index}
  });
  this.setData({tempUrl: this.data.tempUrl.concat(list)})
},
deleteImg(e){
  console.log(e)
},
  //照片上传
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
    for(const item of this.data.tempUrl){
      list.push(await this.uploadImg(item));
    }
    // 查询照片访问地址
    return await this.getTempUrl(list)
  },
  async formSubmit(e){
    const avatar = wx.getStorageSync('avatar');
    const nickname = wx.getStorageSync('nickname');
    const location = this.data.location;
    const time = new Date().getTime();
    const {title, sex, description} = e.detail.value;
    const rent = Number(e.detail.value.rent)
    if(title == '')
      return wx.showToast({
        title: '请概况房子基本信息',
        icon:'none'
      })
    else if(rent == '')
      return wx.showToast({
        title: '请输入租金',
        icon: 'none'
      })
    else if(location.address == undefined)
      return wx.showToast({
        title: '请选择位置',
        icon: 'none'
      })
    else {
      wx.showLoading({
        title: '上传中...',
      });
      const list = await this.uploadFile()
      db.add({
        data: {title, sex, description, rent, list, time, location, userInfo: {nickname, avatar}, message: []},
        success: res => {
          wx.hideLoading();
          console.log("post success!", res)   
        }
      })
    }
  },
})