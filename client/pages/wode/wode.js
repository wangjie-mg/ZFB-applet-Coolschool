const app=getApp();
Page({
  data: {
    user:'',
    sex_img:"",
  },
  skip(){
    my.navigateTo({url:"../timecontrol/timecontrol"})
  },
  onLoad(){
    if(app.userId===null){
      app.login();
    }
  },
   onShow() {
    if(app.userId!==null){
       app.mpServerless.db.collection('users').find({
        userid: app.userId
      })
      .then(res => {
        var sex_img = this.data.sex_img;

        if(res.result[0].sex === "未填写"){
              sex_img="../../img/w.png";
        }else if(res.result[0].sex === "男"){
            sex_img="../../img/b.png";
        }else if(res.result[0].sex === "女"){
            sex_img="../../img/g.png";
        }
        this.setData({
          user:res.result[0],
          sex_img
        });
      })
      
    }
    
  },
  onTest(){
    my.navigateTo({ url: '../userupdate/userupdate?name='+this.data.user.name+'&studentid='+this.data.user.studentid+'&college='+this.data.user.college+'&telephone='+this.data.user.telephone+'&sex='+this.data.user.sex })
  }
});
