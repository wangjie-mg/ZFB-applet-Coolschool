const app=getApp();
Page({
  data: {
    value:[],
    comment:[],
    isOpenModal: false,
    id:'',
    plmsg:'',

    type:'1',
    focus:false,
    place:"添加评论...",
    ffuser:'',
    flag:false,
  },
  onLoad(query) {
    app.mpServerless.db.collection("write").find({
     _id:query.id
   }).then(res =>{
    this.setData({
      id:query.id,
      value:res.result[0]
    })
   })
   app.mpServerless.db.collection("comment").find({
     plid:query.id,
     type:"1"
   },{
      sort:{_id:-1},
   }).then(res =>{
      const c = res.result;
     const comment=c.map(item =>{
       item.time = app.time(item.time);
       return item;
     })
        
        app.mpServerless.db.collection("comment").find({
          plid:query.id,
          type:'2'
        }).then(twe =>{
          for(let i=0;i<twe.result.length;i++){
            const plnum=comment.findIndex(item => item._id===twe.result[i].ffuser);
            comment[plnum].twmsg.push(twe.result[i]);
          }
          this.setData({
            comment
          })
        })
   })
  },

  onff(e){
    const id = e.target.dataset.id;
    const comment = this.data.comment;
    this.setData({
      flag:true,
      place:'回复'+comment[id].name,
      ffuser:comment[id]._id,
      focus:true,
      type:"2",
      plmsg:'',
    })
  },

  outff(){
    this.setData({
      flag:false,
      place:'添加评论...',
      ffuser:'',
      focus:false,
      type:"1",     
    })
  },
  onsubmit(){
    if(this.data.plmsg){
      const a=new Date();
      const obj={
        userid:app.userId,
        plid:this.data.id,
        value:this.data.plmsg,
        name:app.userInfo.nickName,
        ava:app.userInfo.avatar,
        twmsg:[],
        type:this.data.type,
        ffuser:this.data.ffuser,
        time:a.getTime(),
      }
      app.mpServerless.db.collection('comment').insertOne(obj).then(res => {
        app.mpServerless.db.collection('write').updateOne({
          _id:this.data.id
        },{
          $set:{
            comment:this.data.value.comment+1
          }
        }).then(resava=>{
          const value = this.data.value;
          const comment = this.data.comment;
          value.comment++;
            obj._id = res.result.insertedId;
          if(this.data.type==="1"){
            obj.time=app.time(obj.time);
            comment.splice(0,0,obj);
          }else{
            const plnum=comment.findIndex(item => item._id===this.data.ffuser);
            comment[plnum].twmsg.push(obj)
          }
          this.setData({
            value,
            comment,
            flag:false,
            place:'添加评论...',
            ffuser:'',
            focus:false,
            type:"1",      
            plmsg:''
          })
        })
      })
    }else{
      my.alert({
        title: '亲',
        content: '要写内容才能发表哦！',
        buttonText: '我知道了',
      });
    }
  },
  good(e){
      const value = this.data.value;
      let num;
      if(value.gooduser.includes(app.userId)){
         num=e.target.dataset.num-1;
         value.gooduser.splice(value.gooduser.findIndex(item => item===app.userId),1);
      }else{
        num=e.target.dataset.num+1;
        value.gooduser.push(app.userId);
      }

      app.mpServerless.db.collection("write").updateOne({
        _id:e.target.dataset.id
      },{
        $set:{
          good: num,
          gooduser:value.gooduser
        }
      }).then(res=>{
        value.good=num;
        this.setData({
          value
        })      
      })
    },
  onItemInput(e) {
    this.setData({
      [e.target.dataset.field]: e.detail.value,
    });
  },
   onModalClose() {
    this.setData({
      isOpenModal: !this.data.isOpenModal
    })
  },
  
  onImg(node) {
    const { value } = node.target.dataset
    this.setData({
      isOpenModal: !this.data.isOpenModal,
      url: value
    })
  },
});