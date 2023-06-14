// pages/detail/index.js
const db = wx.cloud.database();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail:'',
    iconPath: '',
    marker: [],
    message: ''
  },
  getInputValue(e){
    this.data.detail.message.push(e.detail.value) 
  },
  async leaveMessage(){
    db.collection('list').where({_id: this.data.detail._id}).update({
      data: {
        message:this.data.detail.message
      }
    })
    console.log(this.data.detail.message)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const detail = JSON.parse(decodeURIComponent( options.detail))
    this.setData({
      detail: detail, 
      marker: [{      
        id: 0,
        height: '40',
        width: '25',
        longitude: detail.location.longitude,
        latitude: detail.location.latitude,
        iconPath: '../../img/position.png'
      }]
    });
      // const watch = 
      db.collection('list').doc(this.data.detail._id).watch({
      onChange: snapshot => {
        this.setData({detail: snapshot.docs[0]})
        console.log('snapshot', snapshot.docs[0].message)
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    });
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // this.watch.close()
  },


})