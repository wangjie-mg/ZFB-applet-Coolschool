const cls = Array(30);
const week = ['周一', '周二', '周三', '周四','周五'];
const time = ['1-2节','3-4节','5-6节','7-8节','9-10节','11-12节'];
const app=getApp();
Page({
  data: {
    tagData: cls,
    color:['#12B8F6','#F5A623','#86AFFF','#F8E71D','#C287FF','#5DCE34','#65c294','#72baa7','#f3715c','00a6ac','#f3704b'],
  },
  onShow() {
    app.mpServerless.db.collection('schedule').find({
        userid:app.userId,
    }).then(res=>{
        const tagData =this.data.tagData;
      res.result.map(item =>{
       const  lie = week.indexOf(item.week),
              hang = time.indexOf(item.time);
        tagData[hang*5+lie] = item
      })
      this.setData({
        tagData
      })      
    })
  },
  onslect(){
    app.mpServerless.db.collection('schedule').deleteMany({
        userid:app.userId,
    }).then(res =>{
    console.log(1);
      const tagData =Array(30);
      this.setData({
        tagData
      })
    })
  },
   skip(){
    my.navigateTo({url:"../timeadd/timeadd"});
  },
});
