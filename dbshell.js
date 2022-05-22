const DB = require("./module/db.js");
const db = new DB;
db.open("lyinfo",function(coolection){
	coolection.find({"time":{$type:String}}).forEach(function(v){
		v.time = new Data(v.time);
		coolection.save(v);
	})

})