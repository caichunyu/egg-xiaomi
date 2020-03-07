var BaseController =require('./base.js');
class GoodsTypeAttributeController extends BaseController {
    async index() {
        
        //显示对应类型的属性

        //获取当前属性的类型id   分类id


        var cate_id=this.ctx.request.query.id;

        console.log(cate_id);

      //  var result=await this.ctx.model.GoodsTypeAttribute.find({"cate_id":cate_id});

        var result=await this.ctx.model.GoodsTypeAttribute.aggregate([
        
            {
              $lookup:{
                from:'goods_type',
                localField:'cate_id',
                foreignField:'_id',
                as:'goods_type'      
              }      
           },
           {
              $match:{   //cate_id字符串
                "cate_id":this.app.mongoose.Types.ObjectId(cate_id)   //注意
              }
           }        
        ])
  
        // console.log(result)
        await this.ctx.render('admin/goodsTypeAttribute/index',{

            list:result,
            cate_id:cate_id
        });
    }


    async add() {
        


        //获取类型数据

        var cate_id=this.ctx.request.query.id;
        var goodsTypes=await this.ctx.model.GoodsType.find({});
    
        await this.ctx.render('admin/goodsTypeAttribute/add',{

            cate_id:cate_id,
            goodsTypes:goodsTypes

        });
        
    } 

    async doAdd() {


            var res=new this.ctx.model.GoodsTypeAttribute(this.ctx.request.body);
            
            await res.save();   //注意

            await this.success('/admin/goodsTypeAttribute?id='+this.ctx.request.body.cate_id,'增加商品类型属性成功');


    } 


    
    //功能还没有实现
    async edit() {


        var id=this.ctx.query.id;

        var result=await this.ctx.model.GoodsType.find({"_id":id});

        await this.ctx.render('admin/goodsType/edit',{

            list:result[0]
        });
    
    } 

    async doEdit() {
    

        var _id=this.ctx.request.body._id;
        var title=this.ctx.request.body.title;
        var description= this.ctx.request.body.description;

        await this.ctx.model.GoodsType.updateOne({"_id":_id},{
            title,description
        })
        await this.success('/admin/goodsType','编辑类型成功');     

    } 
   
}
module.exports = GoodsTypeAttributeController;