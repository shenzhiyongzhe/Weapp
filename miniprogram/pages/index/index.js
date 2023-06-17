// index.js
import formatTime from '../../utils/formatTime.js'
const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {
    list: [],
    pageIndex: 0,
    pageSize: 5,
    isMax: false,
    isActive: -1,
    navList: ['区域', '租金', '筛选', '排序'],
    districtList: ['南山区', '宝安区'],
    slider: 0,
    limitSex: [true, false, false, false],
    limitSexList: ['默认', '限男生', '限女生', '不限男女'],
    checkboxList: [[true, '默认'], [false, '可短租'], [false, '近地铁'], [false, '有阳台']],
    selectedBox: {},
    sortList: ['默认排序', '时间最新', '价格最低'],
    sortFlag: ['default', 'sortByLatest', 'sortByCheapest'],
    clear_icon_show: false,
    queryField: {},
    refreshFlag: [false, false, false, false],
    userInfo: {},
    isRefresh: true,
    scrollTop: 0,
    loadFlag: 'default'
  },

  test(e){
    console.log(e.detail)
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
  // 触底加载
  async reachBottomLoad(){
    const {isMax, queryField, loadFlag} = this.data;
    console.log("isMax:", isMax, "loadFlag:", loadFlag)
    if(isMax == false){
      switch(loadFlag){
        case 'default':
          this.getList(); break;
        case 'keyword':
          this.queryData(queryField); break;
        case 'sortByLatest':
          this.queryData({order:{Field:"time", by:"desc"}}); break;
        case 'sortByCheapest':
          this.queryData({order:{Field:"rent", by:"asc"}}); break;
        default : this.getList();
      }
    }
    else
      return console.log('data is load out')
  },
  // 搜索框搜索
  async inputSearch(e){
    this.data.queryField.keyword = e.detail.value;
    this.data.pageIndex = 0;
    this.data.list = [];
    this.data.isMax = false;
    this.data.loadFlag = 'keyword'
    const data = await this.queryData(this.data.queryField);
    if(data){
      this.setData({list: this.data.list.concat(data)})
    }
    else
      return console.log("inputSearch: no data")
  },
  // 下拉菜单点击事件
  showPulldown(e){
    this.setData({isActive: e.currentTarget.dataset.index})
  },
  // 区域的点击事件
  async districtClick(e){
    const index = e.target.dataset.index
    const district = this.data.districtList[index];
    this.data.queryField.keyword =  district;
    this.data.pageIndex = 0;
    const data = await this.queryData(this.data.queryField);
    if(data) 
      this.setData({list: [ ...this.data.list, ...data]})
    else 
      return console.log('District: no data')
    this.setData({isActive: 0})
  },
  // 租金，滑动条
  sliderEvent(e){
    this.data.slider = e.detail.value
  },
  // 租金区间筛选
  async rentConfirm(){
    this.data.queryField.rent = this.data.slider;
    const data = await this.queryData(this.data.queryField)
    if(data) 
      this.setData({list: [ ...this.data.list, ...data]})
    else 
      return console.log('Rent: no data')
    // console.log("rent data:",data)
    this.setData({isActive: -1})
  },
  //排序
  sortEvent(e){
    const index = e.target.dataset.index;
    this.data.loadFlag = this.data.sortFlag[index];
    this.data.isMax = false;
    this.setData({pageIndex: 0, list: []});
    switch(index){
      case 0: this.getList(); break;
      case 1: this.queryData({order:{Field:"time", by:"desc"}}); break;
      case 2: this.queryData({order:{Field:"rent", by:"asc"}}); break;
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


  pulldownHidden(){
    this.setData({isActive: -1});
  },


  onShow() {
    
  },
  async onLoad(){
    this.getList();
  },

});
