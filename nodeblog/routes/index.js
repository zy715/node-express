var express = require('express');
var router = express.Router();

var mongodb = require('mongodb').MongoClient;
var db_str = 'mongodb://localhost:27017/register'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',user:req.session.user});
});


//注册
router.get('/register',function (req,res,next) {
	res.render('register',{});
})
//登录
router.get('/login',function (req,res,next) {
	res.render('login',{});
})

//退出
router.get('/relogin',function(req,res,next){
	//销毁session对象
	req.session.destroy(function(err){
		if(err){
			console.log(err)
		}else{
			res.redirect('/')
		}
	})
})
//留言
router.get('/liuyan',function (req,res,next) {
	res.render('liuyan',{});
})

router.get('/listdet', function(req, res, next) {
  		
  		
			//链接数据库 
			mongodb.connect(db_str,function(err,db) {
					if(err){
						console.log(err);
					}else{
						//调用finddata函数
						finddata(db)
						//关闭数据库
						db.close()
					}
			})
			//查找函数
			var finddata=function(db) {
						//找到要查找的集合
						var coll=db.collection('li')
						//设置需要查找集合的文档数据
						var ooo=req.query.id
					
						coll.find({}).toArray(function(err,litem) {
								if(!err){
									litem.forEach(function(cen,index) {
										if(cen["_id"]==req.query.id){
											res.render("listdet",{con:cen["biaoti"],tit:cen["con"],user:req.session.user})
										}
									})
								}
						})
			}
});
module.exports = router;
