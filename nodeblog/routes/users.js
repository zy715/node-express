var express = require('express');
var router = express.Router();

//快速mongo服务
var mongodb = require('mongodb').MongoClient;
var db_str = 'mongodb://localhost:27017/register'

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//注册
router.post('/form',function (req,res,next) {
//		res.send('注册成功')
	var user=req.body['user']
	var pass =req.body['pass']
	var email = req.body['email']
	
	//插入函数   
	var insertdata = function (db,callback) {
			//找到要插入的集合文档数据
			var coll = db.collection('message');
			var data = [{user:user,pass:pass,email:email}]
			coll.insert(data,function (err,result) {
					if (err) {
						console.log(err)
					}else{
						callback(result)
					}
			})
			
	}
	
	mongodb.connect(db_str,function (err,db) {
		if (err) {
			console.log(err)
		}else{
			console.log("链接成功")
			insertdata(db,function (result) {
				console.log(result)
				res.redirect('/');
			})
			
			//关闭数据库
			db.close()
		}
	})
})

//登录
router.post('/login',function (req,res,next) {
//		res.send('注册成功')
	var user=req.body['user']
	var pass =req.body['pass']
	
	
	//查询函数
	var login = function (db) {
			//找到要匹配的集合文档数据
			var coll = db.collection('message');
			coll.find({user:user,pass:pass}).toArray(function (err,item) {
				if (item.length) {
//					res.send('登陆成功')
//						console.log(item[0])
					req.session.user = item[0].user;
					res.redirect('/');
				}else{
					res.send('登陆失败')
				}
			})
			
	}
	
	mongodb.connect(db_str,function (err,db) {
		if (err) {
			console.log(err)
		}else{
			login(db)
			//关闭数据库
			db.close()
		}
	})
})

//留言
router.post('/list',function (req,res,next) {
	var user = req.session.user;
	if (user) {
			var biaoti=req.body['biaoti']
			var con =req.body['con']
	
	//插入函数   
	var insertdata = function (db,callback) {
			//找到要插入的集合文档数据
			var coll = db.collection('list');
			var data = [{biaoti:biaoti,con:con}]
			coll.insert(data,function (err,result) {
					if (err) {
						console.log(err)
					}else{
						callback(result)
					}
			})
			
	}
	
	mongodb.connect(db_str,function (err,db) {
		if (err) {
			console.log(err)
		}else{
			console.log("留言成功")
			insertdata(db,function (result) {
				console.log(result)
			})
			res.redirect('/users/showlist')
			db.close()
		}
	})
}else{
		console.log("session已经过期")
}

})

//显示留言
router.get('/showlist',function (req,res,next) {
	
	//查询函数
	var login = function (db) {
			//找到要匹配的集合文档数据
			var coll = db.collection('list');
			coll.find({}).toArray(function (err,item) {
				res.render('showlist',{shuju:item})
			})
			
	}
	
	mongodb.connect(db_str,function (err,db) {
		if (err) {
			console.log(err)
		}else{
			console.log("显示成功")
			login(db)
			//关闭数据库
			db.close()
		}
	})
})

module.exports = router;
