'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    // this.ctx.body = 'hi, egg';


    await this.ctx.render('index/home.nj',{

      username:'我是nj模板'
    });
  }
}
module.exports = HomeController;
