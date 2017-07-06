var app=angular.module("stuApp",['ngRoute']);
	app.config(function($routeProvider){
		$routeProvider.when('/list',{
			controller:listController,
			templateUrl:'list.html'
		}).when("/view/:id",{
			controller:detailController,
			templateUrl:'detail.html'
		}).otherwise({
			redirectTo:'/list'
		})
	})
function listController($scope,$http,$rootScope){
	//分页
	$scope.page=1;
	$scope.replace=function(page){
		if(page<1){page=1; return;}
		if(page>$scope.total){page=$scope.total;return;}
		$scope.query({page:page,age:$scope.order});
		$scope.page=page;
	}
	$scope.query=function(param){
		$http({
			method:'GET',
			url:'list',
			params:param
		}).then(function(response){
			$rootScope.list=response.data.data;//获取数组
			$scope.total=Math.ceil(response.data.total);//获取总页数
		},function(response){
			alert('系统繁忙，请稍后再试');
		});
	}
	//查询所有学生信息
	$scope.query({page:$scope.page,age:$scope.order});
	//排序
	$scope.orderby=true;
	$scope.order=1;
	$scope.sortQuery=function(){
		$scope.orderby=!$scope.orderby;
		$scope.order=$scope.orderby?1:-1;
		$scope.query({page:$scope.page,age:$scope.order});
	}
	//搜索
	$scope.sou=function(){
		$http({
			method:'POST',
			url:'sou',
			headers:{'Content-Type': 'application/x-www-form-urlencoded'},
			data:'ext='+$scope.ext
		}).then(function(response){
			$rootScope.list=response.data;
		},function(response){
			alert('系统繁忙，请稍后再试');
		})
	}
	//修改数据
	$scope.update=function(id,index){
		var user=$rootScope.list[index];
			$scope.name=user.username;
			$scope.age=parseInt(user.userage);
			$scope.sex=user.usersex;
			$scope.tel=user.usertel;
			$scope.ul=user.userul;
			$scope.num=user.usernum;
			$scope.id=id;
	}
	//添加一个学生
	$scope.save=function(){
		var obj={
			name:$scope.name,
			age:$scope.age,
			sex:$scope.sex,
			tel:$scope.tel,
			ul:$scope.ul,
			num:$scope.num
		}
		if($scope.id||$scope.id==0){
			obj.id=$scope.id;
		}
		$http({
			method:'POST',
			url:'save',
			headers:{'Content-Type': 'application/x-www-form-urlencoded'},
			data:$.param(obj)
		}).then(function(response){
			if(response.data=="success"){
				location.reload();
			}else{
				alert('系统繁忙，请稍后再试');
			}
		},function(response){
			alert('系统繁忙，请稍后再试');
		})
	}
	//全选、返选
	$scope.checks=false;
	$scope.all=function(){
		$scope.checks=!$scope.checks;
	}
	//删除
	$scope.deleteUser=function(index){
		$http({
			method:'POST',
			url:'del',
			headers:{'Content-Type': 'application/x-www-form-urlencoded'},
			data:'id='+index
		}).then(function(response){
			if(response.data=='success'){
				location.reload();
			}else{
				alert("系统繁忙，请稍后再试");
			}
		},function(response){
			alert("系统繁忙，请稍后再试");
		});
	}
	//删除一个学生
	$scope.del=function(index){
		if(!confirm("确定要删除吗"))return;
		$scope.deleteUser(index);
	}
	//多选删除
	$scope.delAll=function(){
		var boxList=angular.element('input[type=checkbox]:checked');
		if(confirm('确定要删除以上'+boxList.length+'条信息吗？')){
			boxList.each(function(index,ele){
//				console.info(ele.value);
				$scope.deleteUser(ele.value);
			})
		}
	}
}
function detailController($scope,$routeParams,$rootScope){
	var id=$routeParams['id'];
	$scope.user=$rootScope.list[id];
}
