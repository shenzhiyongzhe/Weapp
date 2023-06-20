import formatTime from '../../utils/formatTime.js'
const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {
    list: [],
    pageIndex: 0,
    pageSize: 5,
    isActive: -1,
    isMax: false,
    navList: ['区域', '租金', '筛选', '排序'],
    districtList: ['南山区', '宝安区', '罗湖区', '龙华区'],
    slider: 100,
    sortList: ['默认排序', '时间最新', '价格最低'],
    queryPara: {keyword: '', district: '', rent: 2000, select:{sex: ["", "不限", "男生", "女生"]}, order: {field: '_id', by: 'asc'}},
    userInfo: {},
    isRefresh: true,
    scrollTop: 0,
    isEmpty: false,
  },

  test(e){
  console.log(e)


  },
  // 获取房子的列表信息
  async getList() {
      const data = await this.queryData(this.data.queryPara);
      if(data !== null)
        this.setData({list: this.data.list.concat(data)})
      console.log("getList data:", data)
  },
  // 查询信息
  queryData({keyword, district, rent, select, order}){
    const {pageIndex, pageSize} = this.data;
    return new Promise( resolve => {
      db.collection('list').limit(pageSize).where(
      _.and([
        _.or([
          {'location.address': db.RegExp({regexp: '.*' + keyword, option: 'i'})},
          {'location.name': db.RegExp({regexp: '.*' + keyword, option: 'i'})},
          {title: db.RegExp({regexp: '.*' + keyword, option: 'i'})},
          {description: db.RegExp({regexp: '.*' + keyword})},
        ]),
        {'location.address': db.RegExp({regexp: '.*' + district})},
        {rent: _.lte(rent)},
        {sex: _.in(select.sex)},
      ]))
      .orderBy(order.field, order.by)
      .skip(pageSize * pageIndex)
      .get()
      .then(res => {
        if(res.data.length > 0){
          this.data.pageIndex++;
          const postList = res.data.map(item => {
            item.time = formatTime(item.time);
            return item
          })
          resolve(postList)
        }
        else{
          this.data.isMax = true;
          resolve(null)
        }
        console.log('return data', res.data, this.data.queryPara)
      }) 
    })
  },
  // 触底加载
  async reachBottomLoad(){
    console.log("isMax:", this.data.isMax)
    if(this.data.isMax == false){
      this.getList()   
    }
    else
      return wx.showToast({
        title: '没有数据了',
        icon: 'none'
      })
  },
  // 搜索框搜索
  async inputSearch(e){
    this.data.pageIndex = 0;
    this.data.list = [];
    this.data.isMax = false;
    this.data.queryPara.keyword = e.detail;
    const data = await this.queryData(this.data.queryPara);
    if(data == null)
      this.setData({isEmpty: true})
    else
      this.setData({list: data, isEmpty: false})
  },
  // 下拉菜单点击事件
  showPulldown(e){
    this.setData({isActive: e.currentTarget.dataset.index})
  },
  // 区域的点击事件
  async districtClick(e){
    const index = e.target.dataset.index
    const district = this.data.districtList[index];
    this.data.queryPara.district =  district;
    this.data.pageIndex = 0;
    const data = await this.queryData(this.data.queryPara);
    if(data != null) 
      this.setData({list: data, isEmpty: false})
    else 
      this.setData({isEmpty: true})
    this.setData({isActive: -1})
  },
  // 租金，滑动条
  sliderEvent(e){
    this.setData({slider: e.detail.value})
  },
  // 租金区间筛选
  async rentConfirm(){
    this.data.queryPara.rent = this.data.slider;
    const data = await this.queryData(this.data.queryPara);
    if(data != null) 
      this.setData({list: data})
    this.setData({isActive: -1, isEmpty: false});
  },
   // 单选框的点击事件
   sexSelect(e){
     if(e.detail[1] == "默认")
       this.data.queryPara.select.sex = ["", "不限", "男生", "女生"]
    this.data.queryPara.select.sex = [e.detail[1]]
  },
  // 多选框的点击事件
  checkboxSelected(e){
    this.data.selectedBox.rentType = e.detail.value
  },
  // 确定按钮的点击事件
  async checkboxConfirm(){
    console.log("this.data.queryPara", this.data.queryPara);
    const data = await this.queryData(this.data.queryPara);
    if(data == null)
      this.setData({isEmpty: true})
    else
      this.setData({list: data, isEmpty: false})
    this.setData({isActive: -1})
  },
  //排序
  async sortEvent(e){
    const index = e.target.dataset.index;
    this.data.loadFlag = this.data.sortFlag[index];
    this.data.isMax = false;
    this.data.list = [];
    this.data.pageIndex = 0;
    switch(index){
      case 0: 
        this.data.queryPara.order = {field: '_id', by: 'asc'};
        const data_default = await this.queryData(this.data.queryPara); 
        this.setData({list: data_default})
        break;
      case 1: 
        this.data.queryPara.order = {field:"time", by:"desc"}; 
        const data_time = await this.queryData(this.data.queryPara);
        this.setData({list: data_time})
        break;
      case 2: 
        this.data.queryPara.order = {field:"rent", by:"asc"}; 
        const data_rent = await this.queryData(this.data.queryPara); 
        this.setData({list: data_rent})
        break;
      default: console.log("maybe something wrong!")
    }
    this.setData({isActive: -1, isEmpty: false})
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
    // console.log(e.currentTarget.dataset.item)
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
