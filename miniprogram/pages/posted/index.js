// pages/posted/index.js
const db = wx.cloud.database();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 0,
    pageSize: 5,
    maxCount: 0,
    openid: wx.getStorageSync('openid'),
    list: [],
    isEmpty: false
  },
  getMaxCount(openid){
    return new Promise(resolve => {
      db.collection('list').where({_openid: openid}).count().then(res => resolve(res.total))
    })
  },
  getPosted(){
    const {pageIndex, pageSize, maxCount} = this.data;
    console.log(maxCount, this.data.openid)
    if(maxCount === 0){
      console.log("还未发布帖子")
    }
    else if(this.data.list.length == 0){
      this.setData({isEmpty: true})
      console.log("没有数据了")
    }

  },
  navToHistory(e){
    wx.navigateTo({
      url: `/pages/historyDetail/index?item=${encodeURIComponent(JSON.stringify(e.currentTarget.dataset.item))}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const openid = options.openid;
    const maxCount = await this.getMaxCount(openid);
    if(maxCount === 0)
      this.setData({isEmpty: true})
    db.collection("list").where({_openid: openid}).watch({
      onChange: snapshot => {
        // snapshot.docs[0] = formatTime(snapshot.docs[0].time)
        this.setData({list: snapshot.docs})
        if(snapshot.docs.length === 0)
          this.setData({isEmpty: true})
        console.log('snapshot', snapshot.docs)
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })
  },

  //触底加载
  async reachBottomLoad(){
   
  },
})