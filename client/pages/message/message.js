const app=getApp();
Page({
  data: {
      value:"1",
      flag:"1",
      nshow: false,
      fshow:false,
      write:[],
      show: false, 
      skip:0,
  },
  onLoad(query){  
      this.setData({
        flag:query.type
      })
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
     nshow: !this.data.nshow,
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
