export default function(time){
  // if(typeof time === number){
    const timeDiff = new Date().getTime() - time;
    const second = Math.floor(timeDiff / 1000);
    const minitue = Math.floor(second / 60);
    const hour = Math.floor(minitue / 60);
    const day = Math.floor(hour / 24);
    const month = Math.floor(day / 30);
    const year = Math.floor(month / 12);
    if(second < 60)
      return second + '秒前'
    else if(minitue < 60)
      return minitue + '分钟前';
    // 小时差
    else if(hour < 24)
      return hour + '小时前';
    // 天数差
    else if(day < 30)
      return day + '天前';
    // 月差
    else if(month < 12)
      return month + '月前'
    // 年差
    else 
      return year + '年前';
  // }
  // else return ''
}
// console.log(formatTime(1686382587970))