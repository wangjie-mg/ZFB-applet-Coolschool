const {mpServerless} = getApp();
const app = getApp();
Page({
  data: {
    inputvalue: '',
    inputtitle:'',
    isOpenModal: false,
    imgs:[],
  },
  onLoad() {
    this.setData({
      imgs:[]
    })
  },


    onItemInput(e) {
    this.setData({
      [e.target.dataset.field]: e.detail.value,
    });
  },
 
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
    if (this.data.inputvalue!=='' &&this.data.inputtitle!=='' ) {
      var date= new Date();
      const obj = {
          urls: this.data.imgs,
          details: this.data.inputvalue,
          title:this.data.inputtitle,
          userid:app.userId,
          time:date.getTime(),
      }
      await mpServerless.db.collection('active').insertOne(obj).then((res =>{
        console.log(res);
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
