var express=require("express");//导入express方法(模块)
var app=express();//生成核心server对象
var bodyParser=require("body-parser");//解析post请求的
var urlParser=bodyParser.urlencoded({extended:false});//post
app.use(express.static(__dirname));//托管静态文件
var Student=require("./student.js");//导入Student.js
app.listen(8001);
app.get("/",function(req,res){
	res.sendFile(__dirname+"/index.html");
})

//分页
app.get('/list',function(req,res){
	var age=!req.query.age?1:req.query.age;
	console.log(age);
	var pageSize=3;							//一页多少条
	var currentPage=req.query.page;			//当前第几页
	var condition={};						//条件
	var skipnum=(currentPage-1)*pageSize;	//跳过数
	var sort={userage:age};
	Student.count(condition,function(err,result){
		var count=result;			//总条数
		Student.find(condition).skip(skipnum).limit(pageSize).sort(sort).exec(function(err,result){
			if(err){
				console.log('Error:'+err);
			}else{
				var obj={total:count/pageSize,data:result};
				res.send(obj);
			}
		})
	})
})
//添加或修改保存
app.post('/save',urlParser,function(req,res){
	var m={username:req.body.name,userage:req.body.age,usersex:req.body.sex,
			usertel:req.body.tel,userul:req.body.ul,usernum:req.body.num};
	console.log(req.body.id);
	if(req.body.id){
		Student.update({_id:req.body.id},m,function(err,result){
			if(err)console.error(err);
			if(result.ok>0){
				res.send('success');
			}else{
				res.send('fail');
			}
		})
	}else{
		var str=new Student({
			username:m.username,
			userage:m.userage,
			usersex:m.usersex,
			usertel:m.usertel,
			userul:m.userul,
			usernum:m.usernum
		})
		str.save(function(err,result){
			if(err)console.error(err);
			if(result._id){
				res.send('success');
			}else{
				res.send('fail');
			}
		})
	}
})
//搜索
app.post('/sou',urlParser,function(req,res){
	var n=req.body.ext;
	var reg=new RegExp(n,"i");
	var whereStr={username:{$regex:reg}};
	Student.find(whereStr,function(err,result){
		if(err){
			console.log('Error:'+err);
		}else{
			console.log("Res"+result);
			res.send(result);
		}
	})
})
//删除
app.post('/del',urlParser,function(req,res){
	console.log('delete.....');
	Student.remove({_id:req.body.id},function(err,result){
		if(err){console.error(err);}
		console.log(result.result.ok);
		if(result.result.ok>0){
			res.send('success');
		}else{
			res.send('fail');
		}
	})
})
