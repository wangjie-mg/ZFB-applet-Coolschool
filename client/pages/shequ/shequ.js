const app=getApp();
Page({
  data:{
      titleBarHeight:0,
      aflag:0,
      size1:"1.2em",
      size2:"1em",
      size3:"1em",
      value:"1",
      flag:"0",
      nshow: false,
      fshow:false,
      write:[],
      show: false, 
      skip:0,
  },
  onLoad() {
    my.getSystemInfo({
      success:(res) =>{
        this.setData({
          titleBarHeight:res.titleBarHeight
        })
      }
    });
    if(app.userId===null){
      app.login();
    }  
  },
onShow(){
  this.onsign();
  this.setData({
    nshow:false,
  })
},
  onMaskClick() {
   this.setData({
     nshow: false,
   });
 },
 onShowPopoverTap() {
   this.setData({
     nshow: !this.data.show,
   });
 },
 itemTap1(){
   my.navigateTo({url:"../postmessage/postmessage?id=0"});
 },
 itemTap2(){
   my.navigateTo({url:"../postmessage/postmessage?id=1"});
 },
 itemTap3(){
   my.navigateTo({url:"../postmessage/postmessage?id=2"});
 },
  change(e){
    if(e.target.dataset.flag=== "0"){
      this.setData({
        size1:"1.2em",
        size2:"1em",
        size3:"1em",
        aflag:0,
        value:"1",
      });
    }else if(e.target.dataset.flag === "1"){
      this.setData({
        size1:"1em",
        size2:"1.2em",
        size3:"1em",
        aflag:1,
        value:"2",
      });
    }else{
      this.setData({
        size1:"1em",
        size2:"1em",
        size3:"1.2em",
        aflag:2,
        value:"3",
      });
    }
      this.setData({
        write:[],
        show:false,
        skip:0,
      })
      this.mySchedulde();
    
  },
  
  onsign(){
      this.setData({
        write:[],
        show:false,
        skip:0,
      })
    this.mySchedulde();
    },

    async scrollMytrip() {
    try {
      const { page, list, } = this.data;
        this.setData({ show: true });
        this.mySchedulde();
    } catch (e) {
      this.setData({ show: false });
    }
  },

  async mySchedulde() {
    try {
      let  write= this.data.write;
      app.mpServerless.db.collection('write').find({
        type:this.data.flag,
        msgtype:this.data.value,
      },{
        limit:5,
        skip:this.data.skip,
        sort: {_id: -1},
      }).then(res=>{
        if(res.result.length===0){
          this.setData({
            fshow:true,
            show:false
          })
        }
        const lengtha = this.data.skip+res.result.length;
        for (let i = 0; i < res.result.length; i++) {
            write.push(res.result[i])
        }
        this.setData({
          write,
          skip:lengtha
        })
      })
    } catch (e) {
      console.log('mySchedulde执行异常:', e);
    }
  },
});
