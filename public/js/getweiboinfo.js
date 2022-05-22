import ajax from "./ajax.js";

function getWeiboInfo(callback){
	ajax({
		url:"/weibo",
		method:"GET",
		callback:function(data,err){
			callback && callback(err,data);
		}
	})

}

module.exports = getWeiboInfo;