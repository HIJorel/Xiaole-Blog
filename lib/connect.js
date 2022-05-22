const fs = require("fs");
const juicer = require("juicer");
const zlib = require("zlib");
const crypto = require("crypto");
const session = require("./session.js");
const parse = require("./parse.js");
const appconfig = require("../config/appconfig.js");

juicer.set({
    'tag::operationOpen': '{#',
    'tag::operationClose': '}',
    'tag::interpolateOpen': '#{',
    'tag::interpolateClose': '}',
    'tag::noneencodeOpen': '##{',
    'tag::noneencodeClose': '}',
    'tag::commentOpen': '{#',
    'tag::commentClose': '}'
});

function send(state,data,headers){
	headers = headers || {};
	headers["Content-Encoding"] = "gzip" ;
	headers["charset"] = "utf-8";
	headers["server"] = "nodejs";
	this.res.writeHead(state,headers);
	if(data){
		zlib.gzip(data,(err,result)=>{
			if(err){
				this.res.end(JSON.stringify({code:500,error:"Gzip Error"}));
				return
			}
			this.res.end(result);
		})
	}else{
		this.res.end();
	}
}

function sendHtml(state,data){
	send.call(this,state,data,{
		"Content-Type" : "text/html"
	});
}


function sendJson(data){
	let json_str = typeof data == "string" ? data :JSON.stringify(data);
	send.call(this,200,json_str,{
		"Content-Type" : "application/json"
	});
}

function sendJsonp(data){
	let json_str = typeof data == "string" ? data :JSON.stringify(data);
	let callbackName = this.url.search.callback || "jsonpCallback" ;
	send.call(this,200,callbackName + "(" + json_str + ")",{
		"Content-Type" : "application/json"
	});
}

function urlParam(req){
	return {
		hostName:getHostName(req.headers.host),
		port:getPort(req.headers.host),
		pathName:getPathName(req.url),
		search:getSearch(req.url)
	}
}

function getHostName(host){
	return host.split(":")[0];

}

function getPort(host){
    return host.split(":")[1];
}

function getSearch(url){
	let search_str = url.split("?")[1];
	if(!search_str){
		return {};
	}
	let search_arr = search_str.split("&");
	let kvObj = {};
	search_arr.forEach(function(v,i){
		let search_kv = v.split("=");
        kvObj[search_kv[0]] = search_kv[1];
	})
	return kvObj
}

function getPathName(url){
	return url.split("?")[0];
}

function Connect(req,res){
	this.req = req;
	this.res = res;
	this.url = urlParam(req);
	this.session = null;
	this._session_start = session;
}

Connect.prototype.send = function(type,a,b,c){
	switch(type){
		case "html" :
		sendHtml.call(this,a,b)
		break;
		case "json" : 
		sendJson.call(this,a)
		break;
		case "jsonp" :
		sendJsonp.call(this,a)
		case "error" :
		send.call(this,500,"<h1>"+ a +"</h1>")
		break;
		default :
		send.call(this,200)
	}
}

Connect.prototype.render = function(file,tempData){
	fs.readFile(file,(err,data)=>{
		if(err){
			this.send("json",{code:500,err:"模板文件读取出错"});
		}
		data = juicer(data.toString(),tempData);
		this.send("html",200,data);     
	})
}

Connect.prototype["cookie"] = function(value){
	var cookieV = this.req.headers.cookie;
	if(typeof value === "object"){
		var cookie_str = "";
		for(let k in value){
            cookie_str += k + "=" + value[k] + ";";
		}
		this.res.setHeader("Set-Cookie",cookie_str);
	}else if(typeof value === "string"){
		return parse.cookie(cookieV)[value];    
	}else{
		return parse.cookie(cookieV);
	}

}

Connect.prototype.sessions = function(callback){
	var me = this;
    if(this.session){
    	callback && callback(this.session)
    }else{
    	var cookies = this.cookie();
    	this.session = new this._session_start(cookies,appconfig.session.data_path,function(cookieObj){
    		me.cookie(cookieObj);
    	},function(session){
            callback && callback(session);
    	})
    }
}
module.exports = Connect;