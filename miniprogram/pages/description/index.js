// pages/description/index.js
Page({

  data: { description: ''},

  navBack(){
    wx.createSelectorQuery().select(".text-description")
      .fields({properties: ["value"]})
      .exec( res => {
        const pages = getCurrentPages();
        const lastPage = pages[pages.length - 2];
        lastPage.setData({description: res[0].value});
        wx.navigateBack();   
      })
  },

  onLoad(options){
    this.setData({description: options.description})

    
    // console.log("options:", options)
  }

})