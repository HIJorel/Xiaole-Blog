const fs = require("fs");
const static = require("./static.js")
var staticReg = /(js$)|(css$)|(html$)|(png$)|(jpg$)|(jpeg$)|(gif$)|(txt$)|(ico$)/;

function findUrl(url,task){ //查找 请求的url 是否与 请求表中的 key 值匹配

	var key = ""; //初始化key

	var d = 0; //记录 url 分割之后 匹配成功的次数 最少错一次 因为这一次有可能是 动态变量

	let urlarr = url.split("/"); //分割 url

    if( task[url] ){

    	key = url;

    	return {

			"key":key,//返回key 值出去 交给外边的函数 去调用 回调
			"var":null//变量路径 对应的那个请求路径

		}
		
    }

	for(let key in task){ //遍历请求路由表
		
		let keyarr = key.split("/"); //分割 请求的路由url
		
		if( keyarr.length === urlarr.length ){ //判断请求表 key 值和url 值切割后的长度是否相同
			
			for (let c = 0; c < keyarr.length; c++) {//遍历分割后的 key 值
				
				if (keyarr[c] === urlarr[c]) {

					d++;		//记录匹配成功次数			

				}
			
			}

            
			if( urlarr.length == 1 && d == 0
			||  urlarr.length == 2 && d == 0 
			||  urlarr.length == 3 && d == 1 
			||  urlarr.length == 3 && d == 0){ // 一次都没有匹配成功  直接跳过 
                d = 0;
				continue  

			}

			if(d == keyarr.length){ //分割后的key 和请求的url 如果完全匹配成功 则返回 直接返回请求的url 然后退出

				key = url;
				
				return {

					"key":key,//返回key 值出去 交给外边的函数 去调用 回调
					"var":null//变量路径 对应的那个请求路径

				}
			
			}         //分割后的key 和 url 如果只有一次未匹配成功 则有可能是动态变量 进入if 判断
			
			else if( d == keyarr.length-1 ){ 
				
				let regStr = null;

				if(regStr = /{.+}/.exec(keyarr[keyarr.length-1])){//如果是变量 进行相应处理
					
					let arr = urlarr;                       //将请求表中的 动态变量匹配出来
					
					let v = urlarr[urlarr.length-1]; // key 中有变量 返回请求url中 与变量对应位置的 路径

					arr[arr.length-1] = regStr[0]; //替换 数组中 最后一个未匹配的成功的值为 变量
                    
                    var str = arr.join("/");//用“/” 把数组链接成字符串  返回key值
					
					key = str;  //总结：最后那一次未匹配成功的值 确定为 _get中的 动态变量 因为是动态的 所以输入的请求 随便是什么
			                    //但是随便输的 调用不了回调 必须替换成 get 表中相应的 那个动态变量
					return {

						"key":key,//返回key 值出去 交给外边的函数 去调用 回调
						"var":v //变量路径 对应的那个请求路径

					} 

					// : 因为只有一次匹配失败 所以可以确定 符合请求表中的key 值 因为是动态的 所以必须把 req.url 中匹配不上的一段值 替换成 {name} 才可调用回调函数
				}else{

					return {

						"key":null,
                        "var":null

				    }  // 匹配失败超过1次 直接丢弃

				}
			
			}else{

				return {

					"key":null,
                    "var":null

				}

			}
		
		}else{ //如果不相同 则跳过  进入下一次循环 直到找到长度相同的的  如果找不到 boo 默认为false
			
			continue
		
		}								
	
	}

	return {

		"key":null,
        "var":null

	}
	
}

function ismalice(url){ //检测非正常用户
	if(url.match(/\.\.\//)){
		return true
	}else{
		return false
	}
}

module.exports = (app,_get,_post,staticFile)=>{

	var pathName = (app.req.url).split("?")[0];

	var pathNameQ = pathName.replace(/^\/|\/$/g,"");//请求路径 去除首尾“/”
	
	var suffix = pathName.split(".");//获取后缀名

	    suffix = suffix[suffix.length-1];

	if(ismalice(app.req.url)){

		return {

			"fn":function(req,res){res.writeHead(500);res.end("页面不存在")},
			"var":null

		}

	}

	if(staticReg.test(suffix)){

		static(app,pathName,suffix,staticFile);

		return {

			"fn":null,
			"var":null

		}

	}

	else if (app.req.method === "GET") {

		let obj = findUrl(pathNameQ,_get);//查找请求表中的get请求是否与 输入的url 匹配 匹配则返回对应回调函数的key 值

		if(  !_get[obj.key] ){ //如果匹配失败返回 空的key值  调用的时候为undefind 执行下一个条件 输出静态 
			
			return  {

				"fn":function(req,res){res.end("路径错误！")},
				"var":null

			}

		}

		return  {

			"fn":_get[obj.key],
			"var": obj.var

		}

	}else if(app.req.method === "POST"){//如果是post 请求 
		
		let obj = findUrl(pathNameQ,_post);//判断请求的 url 是否与 get请求表匹配 匹配成功则返回对应回调函数的key 值
		
		if( !_post[obj.key] ){                   //如果匹配失败返回 空的key值  调用的时候为undefind 执行下一个条件 输出静态 
			
			return {

				"fn":function(req,res){res.end("路径错误！")} ,//返回回调函数 必须在 http.createserver(function(req,res){ “内部调用” }) 在这里调用 response 会出问题
			    "var": null

			}
		
		}
		
		return {

			"fn":_post[obj.key] ,//返回回调函数 必须在 http.createserver(function(req,res){ “内部调用” }) 在这里调用 response 会出问题
		    "var": obj.var

		}
	
	}
	
}