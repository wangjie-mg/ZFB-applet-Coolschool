const { mpServerless } = getApp()

const app=getApp();
Page({
  data: {
    items: [
     { checked: true, disabled: false, value: '1', desc: '普通', id: 'checkbox1' },
     { checked: false, disabled: false, value: '2', desc: '跳蚤市场', id: 'checkbox2' },
     { checked: false, disabled: false, value: '3', desc: '学习资料', id: 'checkbox3' },
   ],
    value:[{
      title:"快来发表帖子吧！",
      con:"来分享有趣的人生！"
    },{
      title:"你喜欢谁呢？",
      con:"喜欢不要藏在心里，快说出来吧！"
    },{
      title:"到底丢的什么东西呢",
      con:"来一点描述吧。"
    }],
    id:'',
    datatime:'',
    imgs: [],
    radio:'1',
    inputvalue: '',
    inputtitle:'',
    isOpenModal: false
  },
   radioChange(e) {
    this.setData({
      radio:e.detail.value
    })
  },
  onLoad(query) {
     this.setData({
       id:query.id,
       imputtitle:'',
       inputvalue:'',
       imgs:[]
     })
  },
    onItemInput(e) {
    this.setData({
      [e.target.dataset.field]: e.detail.value,
    });
  },
 
  // 选择并上传图片，获得图片 URL
  attach() {
    my.chooseImage({
      chooseImage: 1,
      success: res => {
        const path = res.apFilePaths[0];
        const options = {
          filePath: path,
          headers: {
            contentDisposition: 'attachment',
          },
        };
        mpServerless.file.uploadFile(options).then((image) => {
          const { imgs } = this.data
          imgs.push(image.fileUrl)
          this.setData({
            imgs,
          });
        }).catch(console.log);
      },
    });
  },
  // 保存到数据库
  async submit() {
    console.log(this.data.radio);
    if (this.data.inputvalue!=='' &&this.data.inputtitle!=='' ) {
      var date= new Date();

      const obj = {
          type:this.data.id,
          msgtype:this.data.radio,
          urls: this.data.imgs,
          details: this.data.inputvalue,
          title:this.data.inputtitle,
          userid:app.userId,
          comment:0,
          good:0,
          gooduser: [],
          name:app.userInfo.nickName,
          ava:app.userInfo.avatar,
          time:date.getTime(),
      }
      await mpServerless.db.collection('write').insertOne(obj).then((res =>{
        this.setData({
          imgs:[]
        })
      }))
          my.navigateBack()
    } else {
      my.alert({
        title: '亲',
        content: '要写标题和内容哦。',
        buttonText: '我知道了',
      });
    }
  },

  onModalClose() {
    this.setData({
      isOpenModal: !this.data.isOpenModal
    })
  },
  
  /** 单击图片 */
  onImg(node) {
    const { value } = node.target.dataset
    this.setData({
      isOpenModal: !this.data.isOpenModal,
      url: value
    })
  },
  /** 删除照片 */
  onRemove(node) {
    const { value } = node.target.dataset
    const { src } = node.target.dataset
    const { imgs } = this.data
    mpServerless.file.deleteFile(src);
    imgs.splice(value, 1)
    this.setData({
      imgs
    })
  }
});
