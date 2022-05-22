const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectId;
const mongoConf = require("../config/dbconfig.js");


function _connectDB(callback){
	mongoClient.connect(this.connectUrl,function(err,db){
		if(err){
			console.log("连接数据库失败"+err)
		}
		callback(db);
	})
}

function DB(){
	this.objectId = objectId;
	this.connectUrl = mongoConf.url;
}

DB.prototype = {
	open(collection,callback){ //collection:需要操作的 集合 callback：回调
		var me = this
		_connectDB.call(me,function(db){ //借用连接数据库函数 将里边的this 指向当前this 回调返回 db 对象
			callback(db.collection(collection)); //回调返回 需要操作的集合
			db.close();//关闭
		})
	}
}


module.exports = DB;