// index.js
const db = wx.cloud.database().collection('list');

Page({
  data: {
    
    region: '区域',
    clear_icon_show: false,
    isPulldownDot: false,
    display: 'block',
    pulldownList:{
      'district':  ['罗湖区', '福田区', '南山区','宝安区', '龙岗区', '盐田区', '龙华区', '坪山区', '光明区'],
      'around': ['1km', '2km', '3km', '5km'],
      'metro': ['1号线', '2号线', '3号线', '4号线', '5号线', '6号线', '7号线', '8号线', '9号线', '10号线', '11号线', '12号线']   
    },
    pulldownLeft: [],
    pulldownRight: [],
    leftIndex: 0,
    rightIndex: 0,
    userInfo: {},
    list: [],
    pageIndex: 0,
    pageSize: 10,
    maxCount: 0,
  },

  async tempBtn(){
    // this.pulldownShow();
    // this.parsePulldownList()
    // // this.getValues()
    // this.getUserInfo()
    const list = await this.getList();
    this.setData({list: list});
    console.log(list)
  },
  // 计算页面数据是否到底
  isLoadOut(){
    const {pageIndex, pageSize, maxCount} = this.data;
    return pageIndex * pageSize < maxCount ? true : false
  },
    // 获取用户唯一表示和登录认证
    async getUserOpenId() {
      wx.login({
        success: (res) => {
          //  console.log(res);
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            method: 'GET',
            data: {
              appid: 'wxa09251f5028d3bf0',
              secret: '8c099e637711aac11ca7696b8950532a',
              js_code: res.code,
              grant_type: 'authorization_code',
            },
            success: res => wx.setStorageSync('openid', res.data.openid)
          })
        },
      })
    },
  // 获取房子的列表信息
  getList(){
    const {pageIndex, pageSize, maxCount} = this.data;
    if(pageIndex * pageSize < maxCount) 
      return new Promise( resolve => 
        db.limit(10).where({}).skip(pageSize * pageIndex).get()
          .then(res => { this.data.pageIndex++; resolve(res.data); })
      )
    else return false
  },
  async autoGetList(){
    const list = this.data.list
    if(this.isLoadOut()){
      const res = await this.getList();
      this.setData({list: list.concat(res)});
    }
    else
      console.log("no more data!", this.isLoadOut())
  },
  // 获取用户头像和昵称
  getUserInfo(){
    wx.getUserInfo({
      success: res => {
        var {avatarUrl, nickName, gender,} = res.userInfo
        this.setData({userInfo: {avatarUrl, nickName, gender}})
        // console.log(this.data.userInfo)
      }
    })
  },
  leftTapEvent(e){
    this.setData({leftIndex: e.target.dataset.index})
  },
  rightTapEvent(e){
    this.setData({region: this.data.pulldownRight[this.data.leftIndex][e.target.dataset.index]});
    this.pulldownHidden();
  },

  parsePulldownList(){
    var pulldownLeft = Object.keys(this.data.pulldownList); 
    var pulldownRight = Object.values(this.data.pulldownList)
    this.setData({pulldownLeft, pulldownRight})
    // console.log(pulldownLeft, pulldownRight)
    
  },

  RegionChange(e){
    this.setData({region: e.detail.value})
  },

  // 动画
  pulldownShow(){
    this.setData({isPulldownDot: true, display: 'block'});
    this.animate('.pulldown-menu', [
      { translateY: 0, height: 0 },
      { translateY: 10, height: 15},
      { translateY: 20,  height: 30},
    ], 300, function(){
              this.clearAnimation('.pulldown-menu', {opacity: false, translateY: false})
            }.bind(this));

    this.animate('.popup-icon', [ {rotate: 135}],20000, 
      function(){
        this.clearAnimation('.popup-icon', {rotate: false})}.bind(this));       
   
  },
  pulldownHidden(){
    this.animate('.pulldown-menu', [
      { translateY: 20 },
      { translateY: 10},
      { translateY: 0,  },
    ], 300, function(){
      this.clearAnimation('.pulldown-menu', {translateY: true})    
    }.bind(this));
    this.setData({isPulldownDot: false});
    this.animate('.popup-icon', [ {rotate: -45}],300, 
    function(){
      this.clearAnimation('.popup-icon', {rotate: false})}.bind(this)); 
  },

// 辅助元素的点击事件
  pulldownTap(){
    this.pulldownHidden();
    this.setData({isPulldownDot: false})
    console.log('pulldown has been hidden')
  },


  onShow() {
    
  },
  async onLoad(){
    this.parsePulldownList();
    this.data.maxCount = (await db.count()).total;
    // console.log(this.data.maxCount)
    this.getUserOpenId();
    this.autoGetList();
  },
  onReachBottom(){
    this.autoGetList();
  }
});
