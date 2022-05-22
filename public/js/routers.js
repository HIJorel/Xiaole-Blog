//获取路径参数
function getUrlParam(){
	var pathname = location.pathname; 
    return pathname
}
//清除路径前后斜杠
function deleteXiegang(path){
	return path.replace(/^\/|\/$/g,"");
}

//路由中含有变量时 将路由池 中的 path 路径含有变量的部分临时替换成正则表达式 并返回这个新的正则表达式
function replaceParem(path){ // /blog/{id} => /\/blog\/\w[^\/]+$/ 字面量 正则
	path = path.replace(/{\w[^}]+}/g,"[\u4e00-\u9fa5\\w][^\/]+$");
    return new RegExp(path);
}


class Routers{
	constructor(){
		this.routers = {};
		this.beforeFun = null; //切换前 执行的函数
        this.afterFun = null; //切换后 执行的函数
        this.popstateFun = null; //触发 popstate 时执行的函数
	}
    //注册路由
	register(path,callback){
		path = path.replace(/^\/|\/$/g,"");
		if(callback && typeof callback == "function"){
			this.routers[path] = callback;
			return this
		}else{
			console.log("注册路由需要回调函数");
		}
	}
    //路由处理 变化 调用回调函数
    urlChange(path){
    	path = deleteXiegang(path);
    	if( path in  this.routers ){ // 看路由池中 有没有这个path 路径 有的话直接调用回调
    		this.beforeFun && this.beforeFun();
    		this.routers[path] && this.routers[path]();
            this.afterFun && this.afterFun();
    		return true
    	}
    	for(let k_path in this.routers){ //上一层如果没有找到  则进行判断 是否为变量
    		if(  k_path.indexOf("{") != -1 && replaceParem(k_path).test(path) ){ //路由存在 或者 路由中含有变量 {name} 则通过
                let parem = path.split("/");
    		 	parem = parem[parem.length-1];
    			this.beforeFun && this.beforeFun();
                console.log()
                try{
                    this.routers[k_path] && (this.routers[k_path](parem));
                }catch(e){
                    console.error(e);
                }
                this.afterFun && this.afterFun();
    			return true
    		}else{
    			continue
    		}
    	}
    	return false
    }
     
    //执行路由前 需要做的处理
    beforeHandle(callback){
    	callback && ( typeof callback == "function" ) && (this.beforeFun = callback)
    	return this
    }

    //执行路由后 需要做的处理
    afterHandle(callback){
        callback && ( typeof callback == "function" ) && (this.afterFun = callback)
        return this
    }

    popstateHandle(callback){
        callback && ( typeof callback == "function" ) && (this.popstateFun = callback)
        return this
    }

    //初始化
    init(){
    	var me = this;
    	window.addEventListener("load",function(){
    		var path = getUrlParam();
            path = window.decodeURI(path);
    		me.urlChange(path);
    	})
    	window.addEventListener("popstate",function(){
    		var path = getUrlParam();
    		me.urlChange(path);
            me.popstateFun && me.popstateFun();
    	})
    	return this
    }
}

module.exports = new Routers();