// components/radio/radio.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: String,
    lable: String,
    list: Array,
  },

  /**
   * 组件的初始数据
   */
  data: {
    isActive: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(e){
      const index = e.currentTarget.dataset.index;
      switch(this.data.type){
        case "radio":
          for(let i = 0; i < this.data.list.length; i++){
            if(i == index)
              this.data.isActive[i] = true;
            else
              this.data.isActive[i] = false;
          };
          this.setData({isActive: this.data.isActive});
          this.triggerEvent('onChange', [index, e.currentTarget.dataset.item]);
          break;
        case "checkbox":
          this.data.isActive[index] = !this.data.isActive[index];
          this.setData({isActive: this.data.isActive});
          const idxList = this.data.isActive.filter(i => i === true)
          const data = [];
          for(let i = 0; i < idxList.length; i++){
            data.push(this.data.list[i])
          };
          const returnData = [];
          for(let i = 0; i < idxList.length; i++){
            returnData.push([idxList[i], data[i]])
          }
          this.triggerEvent('onChange', returnData);
          break;
        default: console.log("radio type is not defined!")
      }

      console.log(e.currentTarget.dataset, this.data.isActive)
    }
  },
  lifetimes: {
    attached: function(){
      for (let i = 1; i < this.data.list.length; i++) {
        this.data.isActive.push(false)
      }
      if(this.data.type == 'radio')
        this.setData({"isActive[0]" : true})

    }
  }
})
