import { observable } from 'mobx-miniprogram'
export const store = observable({
  // 数据字段
  userinfo: {},
  num: 1,
  numF: 2,
  // 计算属性
  get sum(){
    return this.num + this.numF
  }
})