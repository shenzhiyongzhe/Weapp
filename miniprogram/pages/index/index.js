// index.js
const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {

    clear_icon_show: false,
    isPulldown: [false, false, false, false],
    display: 'block',
    region: '区域',
    filterItem: [
      [["区域"], ['南山区', '宝安区']], 
      [["租金"], [500, 800, 1000, 1200, 1500]]
    ],
    randNum: Math.random(),
    keyword: '',
    userInfo: {},
    list: [],
    pageIndex: 0,
    pageSize: 5,
    maxCount: 0,
    isMax: false,
    isRefresh: true,
    scrollTop: 0,
    limitSex: [true, false, false, false],
    limitSexList: ['默认', '限男生', '限女生', '不限男女'],
    checkboxList: [[true, '默认'], [false, '可短租'], [false, '近地铁'], [false, '有阳台']],
    selectedBox: {},
    sortList: ['默认排序', '时间最新', '价格最低'],
    slider: 0
  },

  tempBtn(keyword){
    this.getList()
    console.log(this.data.pageIndex)
  },
  //下拉刷新
  async pullDownRefresh(){
    const list = await this.getList();
    if(list)
      this.setData({list: this.data.list.concat(list),scrollTop: 0, isRefresh: false})
    else
      setTimeout(()=>{this.setData({isRefresh: false})},800)
    console.log("下拉刷新...");
  },
  //跳转到详情页
  navToPageDetail(e){
    wx.navigateTo({
      url: `/pages/detail/index?detail=${encodeURIComponent(JSON.stringify(e.currentTarget.dataset.detail))}`,
    })
    // console.log(e.currentTarget.dataset.detail)
  },
  //触底加载
  async reachBottomLoad(){
    if(this.data.keyword){
      if(this.data.isMax == false)
      {
        const data = await this.Search(this.data.keyword);
        if(!data[0]) 
          this.setData({isMax: true})
        else 
          this.setData({list: [...this.data.list, ...data]})
        // console.log(data[0])
      }
    else
      console.log('search no more data')
    } 
    else 
      this.getList()
      // console.log("default get list")
  },
  //关键字搜索
  Search(keyword){
    const {pageIndex, pageSize} = this.data;
    return new Promise( resolve => {  
      db.collection('list').limit(pageSize).where(_.or([
        {'location.address': db.RegExp({regexp: '.*' + keyword, option: 'i'})},
        {title: db.RegExp({regexp: '.*' + keyword})},
        {description: db.RegExp({regexp: '.*' + keyword})}
      ]))
      .skip(pageSize * pageIndex).get().then(res => {
        this.data.pageIndex++;
        // console.log('return data', res.data)
        resolve(res.data)
      }) 
    })
  },
  //搜索框搜索
  async inputSearch(e){
    const keyword = e.detail.value;
    console.log(keyword)
    this.setData({keyword, pageIndex: 0, isMax: false, list: []})
    const data = await this.Search(keyword);
    if(!data[0]) 
      return console.log("there is no information about this keyword")
    else 
      this.setData({list: [...this.data.list, ...data]})

    // console.log(data)
  },
  //下拉菜单 区域的点击事件
  async districtClick(e){
    const index = e.target.dataset.index
    const item = this.data.filterItem[0][1][index]
    this.setData({ 
      region: item,
      keyword: item,
      pageIndex: 0,
      list: [],
      active: true
    });
      const data = await this.Search(item);
      if(!data[0]) 
        return console.log('there is no information in this location')
      else 
        this.setData({list: [ ...this.data.list, ...data]})
        // console.log(data[0])
      
    this.setData({isPulldown: false})

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
    const {pageIndex, pageSize, maxCount, list} = this.data;
    if(pageIndex * pageSize < maxCount) 
      db.collection('list').limit(pageSize).skip(pageSize * pageIndex).get()
        .then(res => { 
          this.data.pageIndex++;
          this.setData({ list : list.concat(res.data)})
        })
    
    else return false
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

  // 动画
  regionPulldown(){
    this.setData({"isPulldown[0]": !this.data.isPulldown[0], display: 'block'});
    // this.animate('.pulldown-container', [
    //   { translateY: 0, height: 0 },
    //   { translateY: 10, height: 15},
    //   { translateY: 15,  height: 30},
    // ], 400, function(){
    //           this.clearAnimation('.pulldown-container', {opacity: false, translateY: false})
    //         }.bind(this));    
   
  },
  rentPulldown(){
    this.setData({isPulldown: [false, true, false, false]})
  },
  sliderEvent(e){
    this.data.slider = e.detail.value
  },
  rentConfirm(){
    const rent = this.data.slider;
    db.collection('list').where({
      rent: _.lt(rent)
    })
    .get().then(res => this.setData({list: res.data }))
    // console.log(rent, typeof rent)
    this.setData({isPulldown: [false, false, false, false]})
  },
  selectPulldown(){

    this.setData({isPulldown: [false, false, true, false]})
  },
  sexSelect(e){
    this.data.selectedBox.sex = e.detail.value
  },
  radioClick(e){
    const index = e.currentTarget.dataset.index;
    const list = this.data.limitSex.map( (item, i) => {
      if(i == index)
        return true
      else return false
    })
    this.setData({limitSex: list});
  },
  checkboxClick(e){
    const index = e.currentTarget.dataset.index;
    const list = this.data.checkboxList.map( (item, i) => {
      if(i == index){
        item[0] = !item[0];
        return item
      }
      else return item
    })
    this.setData({checkboxList: list})
    // console.log( e.currentTarget.dataset.index, list)
  },
  checkboxSelected(e){
    this.data.selectedBox.rentType = e.detail.value
  },
  selectSubmit(){
    // this.data.selectedBox.sex = 
    console.log(this.data.selectedBox)
  },
  sortPulldown(){
    this.setData({isPulldown: [false, false, false, true]})
  },
  pulldownHidden(){
    this.setData({isPulldown: [false, false, false, false]});
  },


  onShow() {
    
  },
  async onLoad(){
   
    this.data.maxCount = (await db.collection('list').count()).total;
    this.getList();
  },

});
