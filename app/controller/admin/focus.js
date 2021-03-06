'use strict';


const path=require('path');
const fs=require('fs');

const pump = require('mz-modules/pump');

/*
1、安装mz-modules

https://github.com/node-modules/mz-modules

https://github.com/mafintosh/pump
*/

var BaseController =require('./base.js');
class FocusController extends BaseController {

  async index() {

    //获取轮播图的数据

    var result=await this.ctx.model.Focus.find({});
   
    await this.ctx.render('admin/focus/index',{

      list:result
    });
  }

  async add() {
    await this.ctx.render('admin/focus/add');
  }

  
 

  async doAdd() {

      let parts = this.ctx.multipart({ autoFields: true });
      let files = {};               
      let stream;
      while ((stream = await parts()) != null) {
          if (!stream.filename) {          
            break;
          }       
          let fieldname = stream.fieldname;  //file表单的名字

          //上传图片的目录
          let dir=await this.service.tools.getUploadFile(stream.filename);
          let target = dir.uploadDir;
          let writeStream = fs.createWriteStream(target);

          await pump(stream, writeStream);  

          files=Object.assign(files,{
            [fieldname]:dir.saveDir    
          })
          
      }      

      // [{"focus_img":"/public/admin/upload/20180914/1536895826566.png"}，{"aaaa":"/public/admin/upload/20180914/1536895826566.png"}]

      //{"focus_img":"/public/admin/upload/20180914/1536895826566.png",'aaa':'/wefewt/ewtrewt'}

      //{"focus_img":"/public/admin/upload/20180914/1536895826566.png"，"title":"aaaaaaaa","link":"11111111111","sort":"11","status":"1"}
     

      let focus =new this.ctx.model.Focus(Object.assign(files,parts.field));

      var result=await focus.save();

      await this.success('/admin/focus','增加轮播图成功');





  }
  async edit() {

    var id=this.ctx.request.query.id;

    var result=await this.ctx.model.Focus.find({"_id":id});

    console.log(result);

    await this.ctx.render('admin/focus/edit',{

      list:result[0]
    });

  }

  async doEdit() {
   
      let parts = this.ctx.multipart({ autoFields: true });
      let files = {};               
      let stream;
      while ((stream = await parts()) != null) {
          if (!stream.filename) {          
            break;
          }       
          let fieldname = stream.fieldname;  //file表单的名字

          //上传图片的目录
          let dir=await this.service.tools.getUploadFile(stream.filename);
          let target = dir.uploadDir;
          let writeStream = fs.createWriteStream(target);

          await pump(stream, writeStream);  

          files=Object.assign(files,{
            [fieldname]:dir.saveDir    
          })
          
      }      

      //修改操作

      var id=parts.field.id;


      var updateResult=Object.assign(files,parts.field);
      console.log(updateResult);
      
      
      let result =await this.ctx.model.Focus.updateOne({"_id":id},updateResult);

      await this.success('/admin/focus','修改轮播图成功');


  }



  

 
}

module.exports = FocusController;
