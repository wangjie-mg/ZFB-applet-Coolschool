const app=getApp();
Page({
  data: {
    user:null,
    sex: '',
    studentid:'',
    telephone:'',
    college:'',
    modalOpened: false,
    modalOpened5: false,
    rc1:false,
    rc2:false,
    buttons5: [
      { text: '取消' },
      { text: '确认', extClass: 'buttonBold' },
    ],
    },
  radioChange(e) {
    this.setData({
      sex:e.detail.value
    })
  },
  openModal() {
    if(this.data.user.sex === this.data.sex && this.data.user.studentid === this.data.studentid && this.data.user.telephone === this.data.telephone && this.data.user.college===this.data.college)
    {
      this.setData({
        modalOpened: true,
      });  
    }else{
      this.setData({
        modalOpened5: true,
      });
    }
  },
  onButtonClick5(e) {
    const { target: { dataset } } = e;
    this.setData({
      modalOpened5: false,
    });
    if(dataset.index === 1){
      app.mpServerless.db.collection('users').updateOne({
        userid:app.userId
      }, {
        $set: {
          studentid:this.data.studentid,
          telephone:this.data.telephone,
          sex:this.data.sex,
          college:this.data.college,
        }               
      })
      .then(res => {
        my.switchTab({url:'../wode/wode'})
      })
      .catch(()=>{
        my.alert({
          title: `信息修改错误，请重新修改。`,
          buttonText: '关闭',
        });
      }
      )
    }
  },
  onButtonClick() {
    this.setData({
      modalOpened: false,
    });
  },
  onLoad(query) {
  if(query.sex==="男"){
    this.setData({
      user:query,
      telephone:query.telephone,
      studentid:query.studentid,
      sex:query.sex,
      rc1: true,
      college:query.college,
    })
  }else{
    this.setData({
      user:query,
      telephone:query.telephone,
      studentid:query.studentid,
      sex:query.sex,
      rc2:true,
      college:query.college,
    })
  }
  },
  onItemInput(e) {
    this.setData({
      [e.target.dataset.field]: e.detail.value,
    });
  },
  onClear(e) {
    this.setData({
      [e.target.dataset.field]: '',
    });
  },
  onSubmit(e){
    console.log(e);
  }
  
});
