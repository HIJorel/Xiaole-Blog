const querystring = require("querystring");
const fs = require("fs");

class Fn{
	constructor(){
		

	}
	createID(){
		var this_time = new Date().getTime().toString(32);
		var random = Math.random().toString(32).substr(3);
		var id = (this_time + random).substr(0,16);
		return id
	}
	urlCanshuObj(url){
	    if( url.indexOf("?") == -1 ){
	        return {}
	    }
	    var obj = {};
	    url = url.split("?")[1].split("&");
	    for (var i = 0; i < url.length; i++) {
	        var urlarr = url[i].split("=");
	        obj[urlarr[0]] = urlarr[1];
	    }
	    return obj
	}
	post(req,res,callback){
	    var data = "";
	    req.on("data",function(chunk){
	        data += chunk;
	    })
	    req.on("end",function(){
	    	if(!/^{(.)+}$/.test(data)){
	    		res.writeHead(500,{"Content-Type":"application/json",charset:"utf-8"})
	    		res.end(JSON.stringify({code:500,err:true,messge:"你正在执行非法操作，请立即停止！"}),"")
	    		return
	    	}
	        data = JSON.parse(data);
	        data.time = new Date().getTime();
	        callback(data);
	    })
	}
	date(type,boo){
	    var date = new Date();
	    var Y = date.getFullYear();
	    var M = date.getMonth() + 1;
	    var D = date.getDate();
	    var timeObj = {
	        "y":Y,
	        "m":M,
	        "d":D
	    }
	    var dayObj = {
	        "1":"星期一",
	        "2":"星期二",
	        "3":"星期三",
	        "4":"星期四",
	        "5":"星期五",
	        "6":"星期六",
	        "0":"星期日"
	    }
	    if( type.indexOf("h") != -1 
	    &&  type.indexOf("f") != -1
	    ){
	        var h = date.getHours();
	        var f = date.getMinutes();
	        var s = date.getSeconds();
	        f = f.toString().length == 1 ? "0"+f : f
	        s = s.toString().length == 1 ? "0"+s : s
	        timeObj.h = h;
	        timeObj.f = f;
	        timeObj.s = s;
	    }
	    if(boo){
	        var d = date.getDay();
	    }
	    for(let k in timeObj){
	        type = type.replace(k,timeObj[k])
	    }
	    return type + (!d ? "" : " "+dayObj[d])
	 
	}
	EnDate(s,type){
        var dayObj = {
            "Mon":"星期一",
            "Tue":"星期二",
            "Wed":"星期三",
            "Thu":"星期四",
            "Fri":"星期五",
            "Sat":"星期六",
            "Sun":"星期日"
        }
        var monthobj = {
            "Jan":"1",
            "Feb":"2",
            "Mar":"3",
            "Apr":"4",
            "May":"5",
            "Jun":"6",
            "Jul":"7",
            "Aug":"8",
            "Sep":"9",
            "Oct":"10",
            "Nov":"11",
            "Dec":"12"
        }
        var date = new Date(Number(s));
        var datearr = date.toString().split(" ");
        var timeObj = {
            "y":datearr[3],
            "m":monthobj[datearr[1]],
            "d":datearr[2],
            "t":datearr[4],
            "w":dayObj[datearr[0]]
        }
        
        for(let k in timeObj){
            type = type.replace(k,timeObj[k])
        }
        return type
     
    }
    //formidable 文件加后缀 第一个参数是 files 对象 可以避免每次调用都要获取后缀 拼接 才穿参数过来
    uploadFileAddSuffix(files){
    	return new Promise((resolve,reject)=>{
    		if(!files.file){
    			resolve("");
    			return
    		}
    		var filename = files.file.name;
	        var suffix = filename.split(".");
	        suffix = "." + suffix[suffix.length-1];
	        var filePath = files.file.path;
    		fs.rename(filePath,filePath + suffix,(err)=>{
	    		if(err){
	    			reject("改名失败");
	    			return
	    		}
	    		resolve(filePath + suffix);
	    	})
    	})
    }
}

module.exports = Fn;
