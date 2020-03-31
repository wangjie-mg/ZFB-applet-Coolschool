const app=getApp();
Page({
  data: {
    value:[]
  },
  onShow() {
    app.mpServerless.db.collection('active').find({},{
      sort:{
        _id:-1
      }
    }).then(res=>{
      res.result.map(item=>{
        item.time = new Date(item.time).toLocaleString()
      })
        this.setData({
          value:res.result
        })
    })
  },
  onskip(){
    app.mpServerless.db.collection('users').find({
      userid:app.userId
    }).then(res =>{
      if(res.result[0].key){
        my.navigateTo({
          url: '../activeadd/activeadd'
        });
      }else{
        my.alert({
        title: '亲',
        content: '你不是管理员，不能发布活动哦',
        buttonText: '我知道了',
      });
      }
    })
    
  },
  onskipvalue(e){
    my.navigateTo({
      url: '../activevalue/activevalue?id='+e.target.dataset.id
    });
  }
});