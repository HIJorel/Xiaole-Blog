const db = new (require("./db.js"));

module.exports = function(callback){
	db.open("article",(collection)=>{
		collection.find({}).toArray((err,data)=>{
			if(err){
				callback && callback(err);
				return
			}
			var tagsObj = {};
			data.forEach((v,i)=>{
				if(typeof v.category_id == "undefined"){
					return
				}
				tagsObj[v.category_id] = tagsObj[v.category_id] ? tagsObj[v.category_id] + 1 : 1;
			})
			
			db.open("category",(collection)=>{
				collection.find({}).toArray((err,data)=>{
					var tagsArr = data;
					for(let k in tagsObj){
						tagsArr.forEach((v,i)=>{
							if(k == v._id){
								v["count"] = tagsObj[k];
							}
						})
					}
					callback && callback(null,tagsArr);
				})
			})
		})
	})
}