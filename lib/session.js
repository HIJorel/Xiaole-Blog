const fs = require("fs");
var cookie_expire_time = 3 * 24 * 60 * 60;
//每晚 3 点  自动清除过期的文件
setInterval(function(){
	let date = new Date();
	if(date.getHours() === 3 && (date.getMinutes() >= 0 && date.getMinutes() < 3)){
		fs.readdir("./temporary/session/",(err,files)=>{
	        if(err){
	        	console.log(err)
	        	return
	        }
	        if(!files.length){
	        	console.log("文件夹下没有文件")
	        	return
	        }
	        function file(num){
	            fs.stat("./temporary/session/"+files[num],(err,stats)=>{
	            	var expire_time = new Date(stats.birthtime).getTime() + cookie_expire_time * 1000;
	            	var this_time = new Date().getTime();
	            	if(this_time >  expire_time){
	                    fs.unlink("./temporary/session/"+files[num],(err)=>{
	                     	if(err){
	                     		console.log("删除文件出错");
	                     		return
	                     	}
	                    })
	            	}
	            	
	            	num ++ ;
	            	if(num == files.length){
	            		return
	            	}else{
	            		file(num)
	            	}
	            })
	        }
	        file(0);
	    })
	}
},1000)

//检测是否为正常session id
function isNormalSessionID(ID){
  if(ID == +ID && ID.length > 5){
    return true;
  }else{
    return false;
  }
}
//保存数据
function save_session(){
	var path = this._sessions_path;
    var data = JSON.stringify(this);
    var me = this;
    fs.writeFile(path,data,(err)=>{
    	if(err){
    		console.log("session 数据写入出错"+err);
    		return
    	}
    	me.create_time = new Date().getTime();
    })
}

//创建id
function createSessionId(){
    return new Date().getTime() + Math.ceil(Math.random()*1000);
}

function Session(cookieObj,session_path,writeCookie,callback){
	this._sessionId = isNormalSessionID(cookieObj["session_id"]) ? cookieObj["session_id"] : createSessionId();
    this._sessions_path = session_path + this._sessionId + ".txt"; 
    this.create_time = null;
    this.expire_time = cookie_expire_time;
    this._sessions_data = this._sessions_data || {};
    if(!cookieObj["session_id"] || !isNormalSessionID(cookieObj["session_id"])){
    	writeCookie({
	    	session_id:this._sessionId,
	    	path:"/",
	    	"Max-Age":this.expire_time,
	    	HttpOnly:true
	    })
    }

    if(fs.existsSync(this._sessions_path)){
    	var me = this;
    	fs.readFile(me._sessions_path,(err,data)=>{
	    	if(err){
	    		console.log("session 数据读取出错"+err);
	    		return
	    	}
	    	var data = JSON.parse(data);
	    	for(let k in data){
	    		me[k] = data[k];	   		
	    	}
	    	callback && callback(this);
	    })
    }else{
    	callback && callback(this);
    }
}

Session.prototype = {
	set:function(parseObj){
		for(let k in parseObj){
			this._sessions_data[k] = parseObj[k];
		}
    	save_session.call(this);
	},
	get:function(key){
        return this._sessions_data[key];
	}
}

module.exports = Session;