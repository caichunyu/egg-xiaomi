'use strict';

var BaseController = require('./base.js');

class ManagerController extends BaseController {
  async index() {
    //查询管理员表并关联角色表
    var result = await this.ctx.model.Admin.aggregate([{

      $lookup: {
        from: 'role',
        localField: 'role_id',
        foreignField: '_id',
        as: 'role'
      }
    }])
    console.log(result.toStr,'result');

    await this.ctx.render('admin/manager/index', {

      list: result
    });

  }

  async add() {

    var roleResult = await this.ctx.model.Role.find();
    await this.ctx.render('admin/manager/add', {

      roleResult: roleResult
    });

  }

  async doAdd() {
    console.log(this.ctx.request.body);

    var addResult = this.ctx.request.body;
    addResult.password = await this.service.tools.md5(addResult.password);

    //判断当前用户是否存在

    var adminResult = await this.ctx.model.Admin.find({
      "username": addResult.username
    });


    if (adminResult.length > 0) {

      await this.error('/admin/manager/add', '此管理员已经存在');
    } else {

      var admin = new this.ctx.model.Admin(addResult);

      admin.save();
      await this.success('/admin/manager', '增加用户成功');
    }
  }

  async edit() {

    //获取编辑的数据

    var id = this.ctx.request.query.id;

    var adminResult = await this.ctx.model.Admin.find({
      "_id": id
    });

    console.log(adminResult);

    //获取角色    
    var roleResult = await this.ctx.model.Role.find();

    await this.ctx.render('admin/manager/edit', {

      adminResult: adminResult[0],

      roleResult: roleResult
    });
  }

  async doEdit() {

    // console.log(this.ctx.request.body);

    var id = this.ctx.request.body.id;
    var password = this.ctx.request.body.password;
    var mobile = this.ctx.request.body.mobile;
    var email = this.ctx.request.body.email;
    var role_id = this.ctx.request.body.role_id;

    if (password) {
      //修改密码
      password = await this.service.tools.md5(password);
      await this.ctx.model.Admin.updateOne({
        "_id": id
      }, {
        password,
        mobile,
        email,
        role_id
      })

    } else {

      //不修改密码
      await this.ctx.model.Admin.updateOne({
        "_id": id
      }, {
        mobile,
        email,
        role_id
      })

    }

    await this.success('/admin/manager', '修改用户信息成功')

  }
}

module.exports = ManagerController;