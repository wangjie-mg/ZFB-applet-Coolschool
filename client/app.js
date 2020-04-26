import MPServerless from '@alicloud/mpserverless-sdk';
import cloud from 'alipay-serverless-sdk';
const mpServerless =  new MPServerless({
  uploadFile: my.uploadFile,
  request: my.request,
  getAuthCode: my.getAuthCode,
}, {
    appId: '2021001141607166', 
    spaceId: 'fedc2fde-4d57-4cd8-8609-e612c1cd1167',
    clientSecret: 'jIeotl07kEe1kL/VSk/yVg==',
    endpoint: 'https://api.bspapp.com'
});
cloud.init(mpServerless);
App({
    userId:null,
    userInfo:null,
    mpServerless,
    time(dateTimeStamp){
          var now = new Date().getTime(),
              diffValue = now - dateTimeStamp;
          if(diffValue < 0){return;}
          var monthC =diffValue/(1000 * 60 * 60 * 24 * 30),
              weekC =diffValue/(7*1000 * 60 * 60 * 24),
              dayC =diffValue/(1000 * 60 * 60 * 24),
              hourC =diffValue/(1000 * 60 * 60),
              minC =diffValue/(1000 * 60);
          let result;
          if(monthC>=1){
              result="" + parseInt(monthC) + "月前";
          }
          else if(weekC>=1){
              result="" + parseInt(weekC) + "周前";
          }
          else if(dayC>=1){
              result=""+ parseInt(dayC) +"天前";
          }
          else if(hourC>=1){
              result=""+ parseInt(hourC) +"小时前";
          }
          else if(minC>=1){
              result=""+ parseInt(minC) +"分钟前";
          }else
          result="刚刚";
          return result;
    },
    sign(){
      my.showLoading({
      content: '正在登陆...'
      });
      mpServerless.user.getInfo().then(user => {
      this.userId = user.result.user.userId;   
      my.getAuthUserInfo({
          success: resava => {
            this.userInfo = resava;
            mpServerless.db.collection('users').find({
              userid: this.userId
            })
            .then(res => {
              if(res.result.length === 0){
                mpServerless.db.collection('users').insertOne({
                  userid:this.userId,
                  ava:resava.avatar,
                  name: resava.nickName,
                  studentid:"未填写",
                  college:"未填写",
                  telephone:"未填写",
                })
              }
              if(resava.avatar !== res.result[0].ava || resava.nickName !==res.result[0].name){
                mpServerless.db.collection('users').updateOne({
                    userid:this.userId
                }, {
                   $set: {
                    ava:resava.avatar,
                    name:resava.nickName
                  }               
                })
                .catch(console.error)
                mpServerless.db.collection('write').updateMany({
                    userid:this.userId
                }, {
                   $set: {
                    ava:resava.avatar,
                    name:resava.nickName
                  }               
                })
                .catch(console.error)
                mpServerless.db.collection('comment').updateMany({
                    userid:this.userId
                }, {
                   $set: {
                    ava:resava.avatar,
                    name:resava.nickName
                  }               
                })
                .catch(console.error)
              }
            })
            .catch(console.error);
          }
      });
    }).catch(console.error);
      my.hideLoading();
    },
    login(){
      
     mpServerless.user.authorize({
      authProvider: 'alipay_openapi'
      }).then(res =>{this.sign()})
      .catch(res  =>{
        my.alert({
          title: '亲',
          content: '必须授权登录才可以正常使用小程序服务,',
          buttonText: '我知道了',
          success: () => {
          my.startPullDownRefresh()

      }
        });
      })
  },
});
