const formidable = require("formidable");
const DB = require("../../../module/db.js");
const conf = require("../../../config/appconfig.js");
const fn = new (require("../../../module/fn.js"));
const images_resize = require("../../../module/images_resize.js");
const connect = require("../../../lib/connect.js");
const db = new DB;
function islogin(req,res,co,callback){
    co.sessions(function(session){
        if(!session.get("username")){
            res.statusCode = 302;
            res.setHeader("location","/admin/login");
            res.end();
        }else{
            callback && callback();
        }      
    })
}

function admin(req,res,co){
    islogin(req,res,co,()=>{
        co.render("./build/admin/index.html",{
            title:"小乐博客后台管理-首页"
        })
    })   
}

function login(req,res,co){
    co.render("./build/admin/login.html",{
        title:"小乐博客后台管理-登录"
    })
}

function article(req,res,name,co){
    islogin(req,res,co,()=>{
        var articleFn = {
        	"add":function(){
                db.open("category",(collection)=>{
                    collection.find({}).toArray(function(err,data){
                        co.render("./build/admin/article_add.html",{
                            title:"小乐博客后台管理-添加文章",
                            category_list:data
                        }) 
                    }) 
                }) 	
        	},
        	"all":function(){
                getlist(req,res,"article",{},function(data){
                    co.render("./build/admin/article_all.html",{
                        title:"小乐博客后台管理-全部文章",
                        list:data.list,
                        pageTemp:data.pageTemp
                    })
                })             	
        	},
            "del":function(){
                var urlCanshu = fn.urlCanshuObj(req.url);
                db.open("article",(collection)=>{
                    collection.remove({_id:db.objectId(urlCanshu["id"])},(err,result)=>{
                        if(err){
                            res.end("<script>alert('删除失败！')</script>","utf-8")
                        }
                        res.end(JSON.stringify({code:200,err:false}),"utf-8")
                    })
                })
            },
            "update":function(){
                var urlCanshu = fn.urlCanshuObj(req.url);
                db.open("article",(collection)=>{
                    collection.find({_id:db.objectId(urlCanshu["id"])}).toArray(function(err,data){
                        db.open("article_content",(collection)=>{
                            collection.find({content_id:data[0].content_id}).toArray(function(cerr,cdata){
                                if(cerr){
                                    res.end(JSON.stringify({code:500,err:"查找数据出错"}));
                                    return
                                }
                                db.open("category",(collection)=>{
                                    collection.find({}).toArray(function(category_err,category_data){
                                        if(category_err){
                                            res.end(JSON.stringify({code:500,err:"查找数据出错"}));
                                            return
                                        }
                                        co.render("./build/admin/article_update.html",{
                                            title:"小乐博客后台管理-文章修改",
                                            id:data[0]._id,
                                            cid:data[0].content_id,
                                            wzTitle:data[0].title,
                                            wzDescription:data[0].description,
                                            wzTag:data[0].tag.join(","),
                                            category_list:category_data,
                                            wzCategory:data[0].category,
                                            wzImgpath:data[0].imgpath ? wzImgpath.replace("build","") : "",
                                            wzContent:cdata[0].content
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            },
            "category":function(){
                getlist(req,res,"category",{},function(data){
                    co.render("./build/admin/article_category.html",{
                        title:"小乐博客后台管理-文章分类",
                        list:data.list,
                        pageTemp:data.pageTemp
                    })
                })  
            }
        }
        if(!articleFn[name]){
        	res.end("路径错误");
        	return
        }
        articleFn[name]();
    })
}

function link(req,res,name,co){
    islogin(req,res,co,()=>{
        var linkFn = {
        	"add":function(){
                co.render("./build/admin/link_add.html",{
                    title:"小乐博客后台管理-添加友链"
                })
        	},
        	"all":function(){
                getlist(req,res,"link",{shstate:"yes"},function(data){
                    co.render("./build/admin/link_all.html",{
                        title:"小乐博客后台管理-全部友链",
                        list:data.list,
                        pageTemp:data.pageTemp
                    })
                })    		
        	},
        	"dsh":function(){
                getlist(req,res,"link",{shstate:"no"},function(data){
                    co.render("./build/admin/link_dsh.html",{
                        title:"小乐博客后台管理-待审核友链",
                        list:data.list,
                        pageTemp:data.pageTemp
                    })
                })
        	},
            "state":function(){
                var urlCanshu = fn.urlCanshuObj(req.url);
                db.open("link",(collection)=>{
                    console.log()
                    collection.update({_id:db.objectId(urlCanshu["id"])},{$set:{shstate:urlCanshu["state"]}},(err,result)=>{
                        if(err){
                            res.end(JSON.stringify({code:500,err:"数据更改出错"}));
                        }
                        res.end(JSON.stringify({code:200,err:false}));
                    })
                })
            },
            "del":function(){
                var urlCanshu = fn.urlCanshuObj(req.url);
                db.open("link",(collection)=>{
                    collection.remove({_id:db.objectId(urlCanshu["id"])},(err,result)=>{
                        if(err){
                            res.end("<script>alert('删除失败！')</script>","utf-8")
                        }
                        res.end(JSON.stringify({code:200,err:false}),"utf-8")
                    })
                })
            }
        }
        if(!linkFn[name]){
        	res.end("路径错误");
            return
        }
        linkFn[name]()
    })
}

function liuyan(req,res,name,co){
    islogin(req,res,co,()=>{
        var liuyanFn = {
        	"all":function(){
                getlist(req,res,"comments",{},function(data){
                    co.render("./build/admin/liuyan_all.html",{
                        title:"小乐博客后台管理-全部留言",
                        list:data.list,
                        pageTemp:data.pageTemp
                    })
                })  
        	},
            "del":function(){
                var urlCanshu = fn.urlCanshuObj(req.url);
                db.open("comments",(collection)=>{
                    collection.remove({_id:db.objectId(urlCanshu["id"])},(err,result)=>{
                        if(err){
                            res.end("<script>alert('删除失败！')</script>","utf-8")
                        }
                        res.end(JSON.stringify({code:200,err:false}),"utf-8")
                    })
                })
            }
        }
        if(!liuyanFn[name]){
        	res.end("路径错误");
            return
        }
        liuyanFn[name](req,res)
    })
}


function ajaxArticle(req,res,name,co){
    islogin(req,res,co,()=>{
        const form = new formidable.IncomingForm();
        form.uploadDir = conf.upload.path;
    	var ajaxArticleFn = {
    		"add":function(){  
                form.parse(req,(err,fields,files)=>{
                    if(err){
                        res.writeHead(500,{"charset":"utf-8"});
                        res.end(JSON.stringify({code:500,err:"服务器错误"}));
                        return
                    }
                    var ID = fn.createID(); 
                    fn.uploadFileAddSuffix(files)
                    .then(function(newpath){
                        return images_resize(newpath,300);
                    }) 
                    .catch(function(err){
                        console.log(err)
                    })  
                    .then(function(imgpath){
                        var articleData = {
                            content_id:ID,
                            category:fields.category,
                            title:fields.title,
                            tag:fields.tag.split(","),
                            description:fields.description,
                            time:new Date().getTime()
                        };
                        var article_content = {
                            content_id:ID,
                            title:fields.title,
                            tag:fields.tag.split(","),
                            description:fields.description,
                            content:fields.content,
                            time:new Date().getTime()
                        };
                        imgpath != "" && (article_content["imgpath"] = imgpath,articleData["imgpath"] = imgpath)
                        db.open("article",(collection)=>{
                            collection.insertOne(articleData,(err,result)=>{
                                if(err){
                                    res.writeHead(500,{"charset":"utf-8"});
                                    res.end(JSON.stringify({code:500,err:"数据库查询出错"}));
                                    return
                                }
                                db.open("article_content",(collection)=>{
                                    collection.insertOne(article_content,(cerr,cresult)=>{
                                        if(cerr){
                                            res.writeHead(500,{"charset":"utf-8"});
                                            res.end(JSON.stringify({code:500,err:"数据库查询出错"}));
                                            return
                                        }
                                        res.writeHead(200,{"charset":"utf-8"});
                                        res.end(JSON.stringify({code:200}));
                                    })
                                })
                            })
                        })   
                    });  
                })
    			/*fn.post(req,res,(data)=>{
                    
    			})*/
    		},
            "all":function(){

            },
    		"update":function(){
                form.parse(req,(err,fields,files)=>{
                    if(err){
                        res.end(JSON.stringify({code:500,err:"服务器错误"}));
                        return
                    }
                    fn.uploadFileAddSuffix(files)
                    .then(function(newpath){
                        return images_resize(newpath,300);
                    }) 
                    .catch(function(err){
                        console.log(err)
                    })  
                    .then(function(imgpath){
                        var articleData = {
                            title:fields.title,
                            category:fields.category,
                            tag:fields.tag.split(","),
                            description:fields.description,
                            time:new Date().getTime()
                        };
                        var article_content = {
                            title:fields.title,
                            tag:fields.tag.split(","),
                            description:fields.description,
                            content:fields.content,
                            time:new Date().getTime()
                        };
                        imgpath != "" && (article_content["imgpath"] = imgpath,articleData["imgpath"] = imgpath)
                        db.open("article_content",(collection)=>{
                            collection.update({content_id:fields.cid},{$set:article_content},(err,result)=>{
                                if(err){
                                    res.end(JSON.stringify({code:500,err:"数据库更新出错"}));
                                    return
                                }
                                db.open("article",(collection)=>{
                                    collection.update({_id:db.objectId(fields.id)},{$set:articleData},(err,result)=>{
                                        if(err){
                                            res.end(JSON.stringify({code:500,err:"数据库更新出错"}));
                                            return
                                        }
                                        res.end(JSON.stringify({code:200,err:false}));
                                    })
                                })
                            })
                        }) 
                    })    
                })
    		},
    		"del":function(){

    		}
    	}
    	if(!ajaxArticleFn[name]){
        	res.end("路径错误");
            return
        }
    	ajaxArticleFn[name](req,res)
    })
}

function ajaxLink(req,res,name,co){
    islogin(req,res,co,()=>{
        var linkAjaxFn = {
            "add":function(){
                fn.post(req,res,(data)=>{
                    data.shstate = "yes";
                    db.open("link",(collection)=>{
                        collection.insertOne(data,(err,result)=>{
                            if(err){
                                res.writeHead(500,{"charset":"utf-8"});
                                res.end(JSON.stringify({code:500,err:"数据库插入出错"}));
                                return
                            }
                            res.writeHead(200,{"charset":"utf-8"});
                            res.end(JSON.stringify({code:200}));
                        })
                    })
                })

            }
        }
        if(!linkAjaxFn[name]){
            res.end(JSON.stringify({code:200,err:"路径错误"}));
            return
        }
        linkAjaxFn[name](req,res)
    })
}

function ajaxAdminLogin(req,res,co){
    fn.post(req,res,(data)=>{
        db.open("admin_user",(collection)=>{
            collection.find({username:data["username"]}).toArray(function(dberr,dbdata){
                if(dberr){
                    res.end(JSON.stringify({code:500,err:"数据库出错"}));
                    return
                }
                if(dbdata.length <= 0){
                    res.end(JSON.stringify({code:404,err:"用户名找不到"}));
                    return
                }else if(String(dbdata[0]["password"]) != String(data["password"])){
                    res.end(JSON.stringify({code:501,err:"密码错误"}));
                    return
                }else{
                    co.sessions(function(session){
                        session.set({username:data["username"]});
                    })
                    res.end(JSON.stringify({code:302,err:false,url:"/admin"})); 
                }               
            })
        })
    })
}

function ajaxCategory(req,res,name,co){
    islogin(req,res,co,()=>{
        var ajaxCategoryFn = {
            add:function(){
                fn.post(req,res,(data)=>{
                    db.open("category",(collection)=>{
                        collection.insertOne({name:data.name,byname:data.byname},(err,result)=>{
                            if(err){
                                res.end(JSON.stringify({code:500,err:"数据库插入出错"}));
                                return
                            }
                            res.end(JSON.stringify({code:200,err:false}))
                        })
                    })
                })
            }
        }
        if(!ajaxCategoryFn[name]){
            res.end(JSON.stringify({code:200,err:"路径错误"}));
            return
        }
        ajaxCategoryFn[name](req,res);
    })
}

function getlist(req,res,collection,findTj,callback){
    db.open(collection,(collection)=>{
        var json = {};
        var pageTemp = "",limit = 10,skip = 0;   
        var urlCanshu = fn.urlCanshuObj(req.url);  
        var page = Number(urlCanshu["page"]);                 
        if(page){  
            
            if(page <= 0){
                res.end(JSON.stringify({code:500,err:"错误的查询参数"}));
                return
            }                    
            limit = Number(urlCanshu["limit"]);
            skip = (page-1)*limit;  
        } 
        collection.find({}).count(function(err,num){
            var count = num;                          
            var pagesNum = Math.ceil(Number(count)/limit);
            var g = 0,len = (5 > pagesNum ? pagesNum : 5);

            if(page > pagesNum){
                res.end(JSON.stringify({code:500,err:"错误的查询参数"}));
                return
            }

            if(page > 4){
                len = page + 2;
                len > pagesNum ? len = pagesNum  : len
                g = len - 5;
            }
            
            var href = req.url.split("?")[0];
            for(g ; g<len ; g++){
                page != g+1 
                ? pageTemp += `<li><a href="${href}?page=${g+1}&limit=10">${g+1}</a></li>`
                : pageTemp += `<li><a href="${href}?page=${g+1}&limit=10" class="active">${g+1}</a></li>`
            }
            json.pageTemp = ` <li>
                          <a href="javascript:;" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                          </a>
                        </li>
                        ${pageTemp}
                        <li>
                          <a href="javascript:;" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                          </a>
                        </li>`   
        }) 
        collection.find(findTj).sort({time:-1}).skip(skip).limit(limit).toArray(function(dberr,dbdata){
            if(dberr){
                res.end(JSON.stringify({code:500,err:"数据库查询出错"}));
                return
            }
            for (var i = 0; i < dbdata.length; i++) {
                dbdata[i].time = fn.EnDate(dbdata[i].time,"y-m-d t w")
            }
            json.list = dbdata;
            callback &&  callback(json)                                    
        }) 
    })
}
function upload(req,res,co){
    
    form.parse(req,(err,fields,files)=>{
        console.log(fields)
        console.log(files)
        res.end()
    })
}
module.exports = {
	admin,
	article,
	link,
	liuyan,
	ajaxArticle,
    ajaxLink,
    login,
    ajaxAdminLogin,
    upload,
    ajaxCategory
}

