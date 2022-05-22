const App = require("./server.js");
const routes = require("./controller/routes/web/");
const routesAdmin = require("./controller/routes/admin/");
const sinaSDK = require("./module/sinaSDK.js");
const app = new App;

app.set({"staticFile":"build"});
app.get("/",routes.publicTemp);
app.get("/liuyan",routes.publicTemp);
app.get("/blog",routes.publicTemp);
app.get("/link",routes.publicTemp);
app.get("/blog/{articleid}",routes.publicTemp);
app.get("/blog/category/{name}",routes.publicTemp);
app.get("/blog/tag/{tagname}",routes.publicTemp);
app.get("/liuyan/get_lylist",routes.get_lylist);
app.get("/ajax/blog/{articleid}",routes.ajaxBlogArticle);
app.get("/ajax/get_bloglist",routes.ajaxBlogList);
app.get("/ajax/link/get_linklist",routes.ajaxLinkList);
app.post("/ajax/addlink",routes.ajaxAddlink);
app.get("/ajax/get_category",routes.getCategory)
app.post("/comments/{name}",routes.comments);

app.get("/weibo",function(req,res,co){
	sinaSDK(function(err,data){
		if(err){
			co.send("json",{code:500,error:"出错"});
			return
		}
		co.send("json",{
			code:200,
			weiboinfo:JSON.parse(data),
			error:false,
			msg:"成功"
		});
	})
});

app.get("/admin",routesAdmin.admin);
app.get("/admin/login",routesAdmin.login);
app.get("/admin/article/{name}",routesAdmin.article);
app.get("/admin/liuyan/{name}",routesAdmin.liuyan);
app.get("/admin/link/{name}",routesAdmin.link);
app.post("/ajax/article/{name}",routesAdmin.ajaxArticle);
app.post("/ajax/link/{name}",routesAdmin.ajaxLink);
app.post("/ajax/category/{name}",routesAdmin.ajaxCategory);
app.post("/ajax/admin/login",routesAdmin.ajaxAdminLogin);
app.post("/upload",routesAdmin.upload)
/*app.get("/favicon.ico",function(req,res){
	res.end();
})*/
