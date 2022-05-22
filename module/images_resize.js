const fs = require("fs");
const path = require("path");
const gm = require("gm");

module.exports = function images_resize(imgpath,w,h){
	return new Promise((resolve,reject)=>{
		if(imgpath == ""){
			resolve("");
			return
		}
		var imgpathArr = imgpath.split(".");
		var suffix = "."+imgpathArr[imgpathArr.length-1];
		var pathName = imgpathArr[0];
		if(arguments.length == 2){
			gm(path.join(imgpath))
			.resize(w)
			.write(path.join(pathName+ "_w" + w + suffix),(err)=>{
				if(err){
					reject(err);
					return
				}
                resolve(pathName+ "_w" + w  + suffix);
			})
		}else{
			gm(path.join(imgpath))
			.resize(w,h,"!")
			.write(path.join(pathName+ "_w" + w + "_h" + h + suffix),(err)=>{
				if(err){
					reject(err);
					return
				}
                resolve(pathName+ "_w" + w + "_h" + h + suffix);
			})
		}
	})
}

