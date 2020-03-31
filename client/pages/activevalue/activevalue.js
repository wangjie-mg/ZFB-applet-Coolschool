const app=getApp();
Page({
  data: {
    value:'',
    isOpenModal: false,

  },
  onLoad(query) {
    console.log(query.id)
    app.mpServerless.db.collection('active').find({
      _id:query.id
    }).then(res =>{
      res.result[0].time = new Date(res.result[0].time).toLocaleString();
      this.setData({
        value:res.result[0]
      })
    })
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
