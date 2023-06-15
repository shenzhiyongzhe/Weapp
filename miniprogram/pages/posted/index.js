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
    list: []
  },
  getMaxCount(openid){
    db.collection('list').where({_openid: openid}).count().then(res => this.setData({maxCount: res.total}))
  },
  getPosted(){
    const {pageIndex, pageSize, maxCount} = this.data;
    console.log(maxCount)

    // if(pageIndex * pageSize < maxCount)
      db.collection('list').limit(10).where({_openid: this.data.openid}).get().then(res => {
        this.setData({list: this.data.list.concat(res.data)})
    })
    // else 
    //   wx.showToast({
    //     title: '暂无数据',
    //     icon: 'none'
    //   });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const openid = options.openid;
    this.getMaxCount(openid);
    this.getPosted()
  },

  //触底加载
  async reachBottomLoad(){
    const {isMax, queryField, loadFlag} = this.data;
    console.log("isMax:", isMax)
    if(isMax == false){
      switch(loadFlag){
        case 'default':
          this.getList(); break;
        case 'keyword':
          this.queryData(queryField); break;
        case 'sortByLatest':
          this.sortBy("time", "desc"); break;
        case 'sortByCheapest':
          this.sortBy("rent", "asc"); break;
        default : this.getList();
      }
    }
    else
      return console.log('data is load out')
  },
})