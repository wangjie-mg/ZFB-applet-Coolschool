const week = ['周一', '周二', '周三', '周四','周五'];
const time = ['1-2节','3-4节','5-6节','7-8节','9-10节','11-12节'];
const app=getApp();
Page({
  data: {
    name:'',
    pop:'',
    place:'',
    week:'周一',
    time:'1-2节',
    },
  onLoad() {},
  onItemInput(e) {
    this.setData({
      [e.target.dataset.field]: e.detail.value,
    });
  },
  onPickerTapa() {
    my.showActionSheet({
      title: '选择周数',
      items: week,
      success: (res) => {
        this.setData({
          week: week[res.index],
        });
      },
    });
  },
  onPickerTapb() {
    my.showActionSheet({
      title: '选择上课时间',
      items: time,
      success: (res) => {
        this.setData({
          time: time[res.index],
        });
      },
    });
  },
  onsubmit(){
    const name = this.data.name,
          pop = this.data.pop,
          place = this.data.place,
          week = this.data.week,
          time = this.data.time;
    if(name!=='' &&pop!=='' && place!==''){
      app.mpServerless.db.collection('schedule').find({
        userid:app.userId,
        week:week,
        time:time,
      }).then(res=>{
        if(res.result.length!==0){
        app.mpServerless.db.collection('schedule').updateOne({
          userid:app.userId,
          week:week,
          time:time,
        },{
          $set:{
            name:name,
            pop:pop,
            place:place,
          }
        }).then(ava=>{
          my.navigateBack()
        });
        }else{
        const obj={
          userid:app.userId,
          flag:true,
          name:name,
          pop:pop,
          place:place,
          week:week,
          time:time,
          color:Math.floor(Math.random() * 10 + 1),
        }
        
        app.mpServerless.db.collection('schedule').insertOne(obj).then(ava =>{
          my.navigateBack()
        });
        }
      })
    }else{
      my.alert({
        title: '亲',
        content: '要添加信息才可以新增课表',
        buttonText: '我知道了',
      });
    }
  }
});
