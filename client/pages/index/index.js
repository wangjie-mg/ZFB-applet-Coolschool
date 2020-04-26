const app=getApp();

Page({
  data:{
    writea:[],
    writeb:[],
    user:null,
    new:true,

    img:[],
    indicatorDots: true,
    autoplay: true,
    vertical: false,
    interval: 2500,
    circular: false,
    duration:1500,
  },
  onLoad(query) {
    if(app.userId===null){
      app.login();
    }
  },
  onPullDownRefresh() {
    if(app.userId===null){
      app.login();
    }
    this.chushi();
    my.stopPullDownRefresh()
  },
  skipa(){
    my.navigateTo({url:"../message/message?type=1"})
  },
  skipb(){
    my.navigateTo({url:"../message/message?type=2"})
  },
  onShow() {
    this.chushi()
  },
  chushi(){
this.setData({
      img:[]
    })
    app.mpServerless.db.collection('active').find({},{
      limit:4,
      sort:{
        _id:-1
      }
    }).then(res =>{
        const img=this.data.img;
        res.result.map(item=>{
          const obj={
            url:item.urls[0],
            title:item.title,
            id:item._id,
          }
          img.push(obj)
        })
        this.setData({
          img
        })
    })

    app.mpServerless.db.collection('write').find({
      type:'1'
    },{
      limit:1,
      sort:{_id:-1}
    }).then(res=>{
      this.setData({
        writea:res.result
      })
    })
    app.mpServerless.db.collection('write').find({
      type:'2'
    },{
      limit:1,
      sort:{_id:-1}
    }).then(res=>{
      this.setData({
        writeb:res.result
      })
    })
  },
    onskip(){
      my.navigateTo({
        url: '../active/active'
      });
    },
    onactive(e){
       my.navigateTo({
        url: '../activevalue/activevalue?id='+e.target.dataset.id
      });
    }
});
