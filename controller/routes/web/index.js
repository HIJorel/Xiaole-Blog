const fs = require("fs");
const querystring = require("querystring");
const DB = require("../../../module/db.js");
const fn = new (require("../../../module/fn.js"));
const db = new DB;

function publicTemp(req,res){
    let co = arguments.length == 4 ? arguments[3] : arguments[2];
    co.render("./build/public.html",{
        title:"小乐博客",
        description:"小乐博客_记录个人点滴，分享学习经验的个人博客",
        keywords:"小乐博客,web前端,js,javascript,nodejs"
    })
}

function get_lylist(req,res,co){
    var CanshuObj = fn.urlCanshuObj(req.url);
    var limit = Number(CanshuObj.limit);
    var skip = (Number(CanshuObj.page) - 1) * limit;
    skip < 0 ? skip = 0 : null;

    db.open("comments",(collection)=>{
        var obj = {};
        var obj1 = {};
        collection.find({cid:CanshuObj.cid}).count(function(err,num){
            obj1.count = num;
        })

        collection.find({cid:CanshuObj.cid}).sort({time:-1}).skip(skip).limit(limit).toArray(function(err,data){
            if(err){
                co.send("json",{code:500,err:"数据库查询出错"});
                return
            }
            obj1.list = data;
            obj.code = 200;
            obj.data = obj1;
            co.send("json",obj);
        });     
    })
}

function ajaxBlogList(req,res,co){
    var urlCanshu = fn.urlCanshuObj(req.url);
    var limit = Number(urlCanshu.limit) || 15;
    var skip = ((Number(urlCanshu.page) - 1) * limit) || 0;
    var tag = urlCanshu.tag ? querystring.unescape(urlCanshu.tag) : null;
    var category = urlCanshu.category ? urlCanshu.category : null;
    var find = (tag && category) 
    ? {$or : [{tag:tag},{category:category}]} 
    : tag 
    ? {tag:tag} 
    : category 
    ? {category:category} 
    : {}
    if(skip < 0){
        co.send("json",{code:500,err:"错误的查询参数"})
        return
    }
    db.open("article",(collection)=>{
        var obj = {};
        var obj1 = {};
        collection.find(find).count(function(counterr,num){
            if(counterr){
                co.send("json",{code:500,err:"数据库查询出错"})
                return
            }
            obj["count"] = num;
        }) 
        collection.find(find).sort({time:-1}).skip(skip).limit(limit).toArray(function(err,data){
           
            if(err){
                co.send("json",{code:500,err:"数据库查询出错"})
                return
            }
            obj["list"] = data;  
            obj1["data"] = obj;
            obj1["code"] = 200;   
            co.send("json",obj1);    
        })
    })
}

function ajaxLinkList(req,res,co){
    var urlCanshu = fn.urlCanshuObj(req.url);
    var limit = Number(urlCanshu.limit);
    var skip = (Number(urlCanshu.page) - 1) * limit;
    if(skip < 0){
        co.send("json",{code:500,err:"错误的查询参数"})
        return
    }
    db.open("link",(collection)=>{
        var linkObj = {};
        collection.find({shstate:"yes"},{shstate:0}).sort({time:-1}).skip(skip).limit(limit).toArray(function(err,data){
            if(err){
                co.send("json",{code:500,err:"数据库出错"})
                return
            }
            linkObj["code"] = 200;
            linkObj["data"] = data;
            co.send("json",linkObj);
        })
    })

}

function ajaxAddlink(req,res,co){
    fn.post(req,res,(data)=>{
        db.open("link",(collection)=>{
            collection.insertOne({
                name:data.name,
                description:data.description,
                url:data.url,
                maill:data.maill,
                shstate:"no",
                time:new Date().getTime()
            },(err,result)=>{
                if(err){
                    co.send("json",{code:500,err:"数据库出错"})
                    return
                }
                co.send("json",{code:200,err:null,msg:"ok"});
            })
        })
    })
}

function ajaxBlogArticle(req,res,articleId,co){

    db.open("article_content",(collection)=>{
        collection.find({content_id:articleId}).toArray(function(err,data){
            if(err){
                co.send("json",{code:500,err:"数据库出错"})
                return
            }
            co.send("json",{
                code:200,
                data:data[0]
            })
        })
    })
}

function getCategory(req,res,co){  
    var getCategorys = require("../../../module/getCategorys.js");
    getCategorys(function(err,data){
        if(err){
            co.send("json",{code:500,err:"数据库出错"})
            return
        }
        co.send("json",{
            code:200,
            data:data
        })
    })   
}

function comments(req,res,name,co){
    var commFn =  {
        "add":function(req,res){
            fn.post(req,res,(data)=>{
                db.open("comments",(collection)=>{
                    collection.insertOne(data,(err,result)=>{
                        if(err){
                            co.send("json",{code:500,err:"数据库出错"});
                            return
                        }
                        co.send("json",{code:200,error:false,msg:"成功"})
                    })
                })
            })
        }
    }
    commFn[name](req,res);
}
    


module.exports = {
    comments,
    publicTemp,
    get_lylist,
    ajaxBlogList,
    ajaxLinkList,
    ajaxAddlink,
    ajaxBlogArticle,
    getCategory
}