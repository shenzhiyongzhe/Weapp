// index.js
const db = wx.cloud.database().collection('list');

Page({
  data: {
    
    region: '区域',
    clear_icon_show: false,
    isPulldownDot: false,
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
    pageSize: 4,
    maxCount: 1,
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
  // 获取房子的列表信息
  getList(){
    const {pageIndex, pageSize, maxCount} = this.data;
    if(pageIndex * pageSize < maxCount) 
      return new Promise( resolve => {
        db.limit(10).where({}).skip(pageSize * pageIndex).get()
          .then(res => { this.data.maxCount++; resolve(res.data); })
      })
    else console.log("no more data!")
  },
  async autoGetList(){
    const list = await this.getList();
    this.setData({list});
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
  // 搜索框清除按钮显示与隐藏
  // show_clear_icon(){
  //   this.setData({clear_icon_show: true})
  // },
  // hidden_clear_icon(){
  //   this.setData({clear_icon_show: false})
  // },
  //显示与隐藏 点击空白的辅助元素
  // show_pulldown_support(){
  //   this.setData({show_pulldown_support: true})
  // },
  // hidden_pulldown_support(){
  //   this.setData({show_pulldown_support: false})
  // },
  // 动画
  pulldownShow(){
    this.animate('.pulldown-menu', [
      { opacity: 0.0,  translateY: 0, height: 0 },
      { opacity: 0.5,  translateY: 10, height: 15},
      { opacity: 1.0,  translateY: 20,  height: 30},
    ], 300, function(){
              this.clearAnimation('.pulldown-menu', {opacity: false, translateY: false})
            }.bind(this));
    this.setData({isPulldownDot: true})
  },
  pulldownHidden(){
    this.animate('.pulldown-menu', [
      { opacity: 1.0,  translateY: 20 },
      { opacity: 0.5,  translateY: 10},
      { opacity: 0.0,  translateY: 0,  },
    ], 200, function(){
      this.clearAnimation('.pulldown-menu', {opacity: true, translateY: true})    
    }.bind(this));
    this.setData({isPulldownDot: false})
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
    this.data.maxCount = (await db.count()).total;
    this.autoGetList();
  },
  onReachBottom(){
    console.log("reach bottom")
    this.autoGetList();
  }
});
