// index.js
import formatTime from '../../utils/formatTime.js'
const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {

    clear_icon_show: false,
    isActive: -1,
    navList:["区域", '租金', '筛选', '排序'],
    districtList: ['南山区', "宝安区"],
    slider: 0,
    queryField: {},
    userInfo: {},
    list: [],
    pageIndex: 0,
    pageSize: 5,
    isMax: false,
    isRefresh: true,
    scrollTop: 0,
    limitSex: [true, false, false, false],
    limitSexList: ['默认', '限男生', '限女生', '不限男女'],
    checkboxList: [[true, '默认'], [false, '可短租'], [false, '近地铁'], [false, '有阳台']],
    selectedBox: {},
    sortList: ['默认排序', '时间最新', '价格最低'],
    sortFlag: ['default', 'sortByLatest', 'sortByCheapest'],
    loadFlag: 'default'
  },

  tempBtn(){
  this.getList()
  },
    // 获取房子的列表信息
  getList() {
    const { pageIndex, pageSize, list} = this.data;
    db.collection('list').limit(pageSize).skip(pageSize * pageIndex).get()
    .then(res => {
      this.data.pageIndex++;
      if(res.data.length === 0)
        this.data.isMax = true
      else {
        const postList = res.data.map(item => {
          item.time = formatTime(item.time);
          return item
        });        
        this.setData({list: list.concat(postList)})    
      }
    })
  },
  // 查询信息
  queryData({keyword='', sex='', rent=1500, order={Field: '_id', by: 'asc'}}){
    const {pageIndex, pageSize, list} = this.data;
    db.collection('list').limit(pageSize).where(_.or([
      {'location.address': db.RegExp({regexp: '.*' + keyword, option: 'i'})},
      {title: db.RegExp({regexp: '.*' + keyword})},
      {description: db.RegExp({regexp: '.*' + keyword})},
    ]), _.and([{rent: _.lt(rent)}, {sex: sex}]))
    .orderBy(order.Field, order.by)
    .skip(pageSize * pageIndex).get().then(res => {
      this.data.pageIndex++;
      if(res.data.length > 0){
        const postList = res.data.map(item => {
          item.time = formatTime(item.time);
          return item
        })
        this.setData({list: list.concat(postList)})
        console.log('return data', res.data)
      }
      else
        this.data.isMax = true
    }) 
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
  //搜索框搜索
  async inputSearch(e){
    this.data.queryField.keyword = e.detail.value;
    this.data.pageIndex = 0;
    this.data.list = [];
    this.data.isMax = false;
    const data = await this.queryData(this.data.queryField);
    if(data){
      this.setData({list: this.data.list.concat(data)})
    }
    else
      return console.log("inputSearch: no data")
  },
  showPulldown(e){
    this.setData({isActive: e.currentTarget.dataset.index})
    console.log(e.currentTarget.dataset.index)
  },
  //下拉菜单 区域的点击事件
  async districtClick(e){
    const index = e.target.dataset.index
    const item = this.data.filterItem[0][1][index]
    this.setData({ list: []});
    this.data.queryField.keyword =  item;
    this.data.pageIndex = 0;
    const data = await this.queryData(this.data.queryField);
    if(data) 
      this.setData({list: [ ...this.data.list, ...data]})
    else 
      return console.log('District: no data')
    this.setData({isActive: -1})
  },
  // 租金区间筛选
  async rentConfirm(){
    this.data.queryField.rent = this.data.slider;
    const data = await this.queryData(this.data.queryField)
    // if(data) 
    //   this.setData({list: [ ...this.data.list, ...data]})
    // else 
    //   return console.log('Rent: no data')
    console.log("rent data:",data)
    this.setData({isPulldown: [false, false, false, false]})
  },
  //排序
  sortBy(key, order="asc"){
    const {pageIndex, pageSize, list} = this.data;
    db.collection('list')
      .orderBy(key, order)
      .skip(pageIndex * pageSize)
      .limit(pageSize)
      .get()
      .then(res => {
        this.data.pageIndex++;
        if(res.data.length == 0)
          {
            this.data.isMax = true;
            return console.log("sort: no data")
          }
        else {
          const postList = res.data.map(item => {
            item.time = formatTime(item.time);
            return item
          })
          this.setData({list: list.concat(postList)});
        }
      });
  },
  sortEvent(e){
    const index = e.target.dataset.index;
    this.data.loadFlag = this.data.sortFlag[index];
    this.data.isMax = false;
    this.setData({pageIndex: 0, list: []});
    switch(index){
      case 0: this.getList(); break;
      case 1: this.sortBy("time", "desc"); break;
      case 2: this.sortBy("rent", "asc"); break;
      default: console.log("maybe something wrong!")
    }
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
  },


  // 动画

  sliderEvent(e){
    this.data.slider = e.detail.value
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
  selectSubmit(e){
    // this.data.selectedBox.sex = 
    console.log(e)
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
    this.getList();
  },

});
