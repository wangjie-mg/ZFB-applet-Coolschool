const app=getApp();
Component({
  mixins: [],
  data: {
    write:[],
  },
  props: {},
  didMount() {
  },
  didUpdate() {
  this.props.write.map(item =>{
    item.time = app.time(item.time);
  })
    this.setData({
      write:this.props.write
    })
  },
  didUnmount() {},
  methods: {
    onskip(e){
      my.navigateTo({url:"../../pages/write/write?id="+e.target.dataset.id});
    },
    good(e){
      const id=e.target.dataset.index;
      let write = this.data.write;
      let num;
      if(write[id].gooduser.includes(app.userId)){
         num=e.target.dataset.num-1;
         
         write[id].gooduser.splice(write[id].gooduser.findIndex(item => item===app.userId),1);
      }else{
        num=e.target.dataset.num+1;
        write[id].gooduser.push(app.userId);
      }
      app.mpServerless.db.collection("write").updateOne({
        _id:e.target.dataset.id
      },{
        $set:{
          good: num,
          gooduser:write[id].gooduser
        }
      }).then(res=>{
        write[id].good=num;
        this.setData({
          write
        })      
      })
    },
  },
});
