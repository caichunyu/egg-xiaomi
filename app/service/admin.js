'use strict';

const Service = require('egg').Service;

var url=require('url');

class AdminService extends Service {
  async checkAuth() {
    /*
        1、获取当前用户的角色        （忽略权限判断的地址    is_super）
        2、根据角色获取当前角色的权限列表                       
        3、获取当前访问的url 对应的权限id
        4、判断当前访问的url对应的权限id 是否在权限列表中的id中
    */

     //1、获取当前用户的角色
     var userinfo=this.ctx.session.userinfo; 

     var role_id=userinfo.role_id;

     var pathname=url.parse(this.ctx.request.url).pathname;         //获取当前用户访问的地址

    //  console.log(pathname);
         
     //忽略权限判断的地址    is_super表示是管理员
        var ignoreUrl=['/admin/login','/admin/doLogin','/admin/verify','/admin/loginOut'];

        if(ignoreUrl.indexOf(pathname)!=-1 || userinfo.is_super==1){
             return true;   //允许访问
        }



     //2、根据角色获取当前角色的权限列表  

     var accessResult=await this.ctx.model.RoleAccess.find({"role_id":role_id});

     var accessArray=[];   //当前角色可以访问的权限列表
     accessResult.forEach(function(value){
        accessArray.push(value.access_id.toString());
     })


     // 3、获取当前访问的url 对应的权限id


    //  var pathname=url.parse(ctx.request.url).pathname;         //获取当前用户访问的地址

     var accessUrlResult=await this.ctx.model.Access.find({"url":pathname});
     

     //4、判断当前访问的url对应的权限id 是否在权限列表中的id中

     if(accessUrlResult.length>0){            

        if(accessArray.indexOf(accessUrlResult[0]._id.toString())!=-1){

            return true;
        }
        return false;  
        
     }

     return false;    
  }
}

module.exports = AdminService;
