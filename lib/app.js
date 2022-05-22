const https = require("https");
const http = require("http");
const fs = require("fs");
const Connect = require("./connect.js");
const router = require("./router.js");

function App(){
   
   	this._get = {}; //get 请求表
	this._post = {}; //post 请求表
	this.staticFile = "";
    
    var me = this;
	
     function httpCallback(req,res){

		var co = new Connect(req,res);

		var obj = router(co,me._get,me._post,me.staticFile);

		if( obj.fn ){

			if( obj.var ){

				obj.fn(req,res,obj.var,co);

				return

			}

			obj.fn(req,res,co);

		}	

	}

    http.createServer(httpCallback).listen(8000,"172.18.16.1");
   

}


App.prototype.set = function(obj){
	this.staticFile = obj.staticFile;
}
App.prototype.get = function(path,callback){ //get 请求的路由 和回调函数 先添加到 json 中 这里称为 “请求任务表” 后期判断 可以在执行回调
		path = path.replace(/^\/|\/$/,""); //去除首尾 “/”
		this._get[path] = callback; //添加到json obj   例： "/dd":function(){}      
	}
App.prototype.post = function(path,callback){ //get 请求的路由 和回调函数 先添加到 json 中 这里称为 “请求任务表” 后期判断 可以在执行回调
		path = path.replace(/^\/|\/$/,""); //去除首尾 “/”
		this._post[path] = callback; //添加到json obj   例： "/dd":function(){}
	}; 

module.exports = App;
