var https = require("https");



    //https://api.weibo.com/oauth2/access_token?client_id=1263376281&client_secret=ac8eb4c696aadeb1d218cf929bb0537c&grant_type=9de77dbba6ff74dfbf1d7c25c1de0f16
    //https://api.weibo.com/2/users/show.json?access_token=2.00RU5toFnszU4B864d3dbcb239Nf8D&screen_name=%E5%B0%8F%E4%B9%90%E5%8D%9A%E5%AE%A2%E7%AB%99%E9%95%BF
function sinaSDK(callback){
	var op = {
		hostname: 'api.weibo.com',
		port: 443,
		path: "/2/users/show.json?access_token=2.00RU5toFnszU4B864d3dbcb239Nf8D&screen_name=%E5%B0%8F%E4%B9%90%E5%8D%9A%E5%AE%A2%E7%AB%99%E9%95%BF",
		method:"GET"
	}
	var req = https.request(op,(res)=>{
		var data = "";
		res.on('data',function(chunk){
		    data += chunk;
		    
		})
		res.on('end',function(){
		    callback && callback(null,data);
		})
	})
	req.on("error",(error)=>{
		callback && callback(error,null);
	})
		
	req.end()
}

module.exports = sinaSDK;
