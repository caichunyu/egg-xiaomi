'use strict';

// https://www.npmjs.com/package/svg-captcha

var svgCaptcha = require('svg-captcha'); //引入验证

var md5 = require('md5');

const Service = require('egg').Service;

class ToolsService extends Service {

  //生成验证码
  async captcha (){    
    var captcha = svgCaptcha.create({ 
        size:1,
        fontSize: 50, 
        width: 100, 
        height:32,
        background:"#cc9966" 
      });

    this.ctx.session.code = captcha.text;   /*验证码的信息*/

    return captcha;
  }
  async md5(str){

    return md5(str);
  }
  async getTime(){

    var d=new Date();

    return d.getTime();

  }
 
}

module.exports = ToolsService;
