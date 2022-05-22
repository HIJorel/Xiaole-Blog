const fs = require("fs");
const path = require('path');
const zlib = require("zlib");
const crypto = require("crypto");
const mime = require("./mime.js");

//用文件 mtime 和 size 生成一个id 用来做 etag
function getEtag(mtime,size){
	const md5 = crypto.createHash("md5");
	return md5.update(Date.parse(mtime).toString() + size.toString()).digest("hex");
}

module.exports = (app,pathName,suffix,staticFile)=>{

	if(fs.existsSync(path.resolve(__dirname, "../"+staticFile + pathName))){ //读取是否有 “req.url” 这个文件
		fs.stat(path.resolve(__dirname, "../"+staticFile + pathName),(err,stats)=>{
			let etag = getEtag(stats.mtime,stats.size);
			let header_etag = app.req.headers["if-none-match"];
			if(header_etag && header_etag == etag){
				app.res.writeHead(304); //使用缓存
				app.res.end();
				return
			}
			try{
				var StreamData = fs.createReadStream(path.resolve(__dirname, "../"+staticFile + pathName));
			}catch(err){
				if(err){
					app.res.writeHead(500);
			        app.res.end("读取文件错误"+path.resolve(__dirname, "../"+staticFile + pathName)+err);
					return
				}
			}
			let header = {
				"Content-Type":mime[suffix] || "text/plain",//设置mime 值
				"Cache-control":"max-age=31536000, public",
				"Last-Modified":stats.mtime.toUTCString(),
				"Etag":etag,
				"charset":"utf-8"
			}
			let encoding = app.req.headers["accept-encoding"];
			if(encoding && encoding.indexOf("gzip") != -1){	
				header["Content-Encoding"] = "gzip";
				app.res.writeHead(200,header);
				StreamData.pipe(zlib.createGzip()).pipe(app.res);
			}else{
				app.res.writeHead(200,header);
				StreamData.pipe(app.res);
			}
		})
	}else{ //找不到文件 进行的操作
	    app.send("json",{code:404,error:false,msg:"未找到指定资源"+path.resolve(__dirname, "../"+staticFile + pathName)})
	}

}