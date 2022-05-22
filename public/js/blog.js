import com from "./com.js";
import ajax from "./ajax.js";
import temps from "./temps.js";

import pb from "./pb.js";

let articleHTML = function(json){
    return `
        <a href="/blog/${json.data.content_id}">
            ${json.suoluetuTemp}         
            <h3>${json.data.title}</h3>
            <div class="articleDes"><p>${json.data.description}</p></div> 
        </a>
        <div class="article_ft">
            <div class="article_ft_left">
                <div class="label_ico"></div>
                <div class="article_label">
                    ${json.articleTagTemp}
                </div>
            </div>
            <div class="article_ft_right article_time">${com.date(json.data.time,"Y M-D")}</div>
        </div>
    `
}

let urlJoin = function(obj){
    var urlArr = [];
    for(let k in obj){
       ( k != "isclearHTML" && k != "count" && k != "title") && urlArr.push(k + "=" + obj[k]);
    }
    return urlArr.join("&");    
}

let addTemp = function(){
    !com.getClass("blog")[0] && (document.getElementsByClassName("page")[0].innerHTML = temps.blog);
}

let addArticleDom = function(data,callback){
    let me = this;
    setTimeout(function(){
        addTemp();
        callback && callback.call(me);
        me.isclearHTML && (com.getClass("blogArticle")[0].innerHTML = "" );
        var articleTemp =  "" ;
        var suoluetuTemp = "" ;

        com.getClass("article_loads")[0].style.display = "none"; 

        if(data.length == 0){
            articleTemp = `<div class="blank_content">还没有文章哟！</div>`;
            com.getClass("blogArticle")[0].innerHTML = articleTemp;
            return
        }

        for(let i = 0;i<data.length;i++){
            var articleTagTemp = "";
            data[i].tag.forEach(function(v,k){
                articleTagTemp += `<a href="/blog/tag/${v}">${v}</a>`;
            })
            data[i].imgpath ? suoluetuTemp = `<div class="blog_thumbnail"><img src="${data[i].imgpath.replace("build","")}"></div>` : null;
            articleTemp = articleHTML({
                data:data[i],
                suoluetuTemp,
                articleTagTemp
            });
            com.createElement("div",function(el){
                el.className = "articleCont";
                el.setAttribute("data-articleid",data[i].content_id);
                el.innerHTML = articleTemp;
                com.getClass("blogArticle")[0].appendChild(el);
            })
        }
        setTimeout(function(){
            pb();
        },200)
    },270) 
}

let addCategoryDom = function(data){
    let categoryTemp = `<li><a href="/blog/">全部</a></li>`;;
    data.forEach(function(v,i){
        categoryTemp += `<li data-id="${v["_id"]}"><a href="/blog/category/${v.byname}">${v.name}</a></li>`
    })
    this.blog_category.innerHTML = categoryTemp;
}

const XIAOLE_BLOG_ARTICLE = "xiaole_blog_article_";
const XIAOLE_BLOG_CATEGORY ="xiaole_blog_category";
const XIAOLE_BLOG_ARTICLE_COUNT = "xiaole_blog_article_count";
let is_Refresh = true; //是否刷新页面 
let blog_obj = {};

class Blog{
    constructor(obj){
        this.obj = obj;
        this.XIAOLE_BLOG_ARTICLE = XIAOLE_BLOG_ARTICLE + (this.obj.tag ? "tag_" + this.obj.tag + "_" : this.obj.category ? "category_" + this.obj.category + "_" : "");
        this.XIAOLE_BLOG_CATEGORY = XIAOLE_BLOG_CATEGORY;
        this.XIAOLE_BLOG_ARTICLE_COUNT = XIAOLE_BLOG_ARTICLE_COUNT;
        this.blog_category = null;
        this.isclearHTML = true;
        this.data = null;
        if(is_Refresh){
            let page = 1;
            while (localStorage.getItem(this.XIAOLE_BLOG_ARTICLE + "page_" + page)) {
                localStorage.removeItem(this.XIAOLE_BLOG_ARTICLE + "page_" + page)
                page ++ ;
            }
           is_Refresh = false; 
        }
        this.obj.title && (document.title = this.obj.title);
        blog_obj = this.obj;
        this.addDom_Article();
        window.addEventListener("scroll",blogListener);
    }

    addDom_Article(){
        let article_cache,category_cache;
        let category_cache_callback = function(){
            this.blog_category = com.getClass("blog_category")[0];
            if(category_cache = localStorage.getItem(this.XIAOLE_BLOG_CATEGORY)){
                addCategoryDom.call(this,JSON.parse(category_cache));
            }else{
                this.get_blog_category();
            }
        }
        if(article_cache = localStorage.getItem(this.XIAOLE_BLOG_ARTICLE + "page_" + this.obj.page)){
            addArticleDom.call(this,JSON.parse(article_cache),category_cache_callback);
        }else{
           this.get_blog_article(category_cache_callback); 
        }
    }

    get_blog_article(callback){
        let requrl = "/ajax/get_bloglist?" + urlJoin(this.obj);
        let me = this;
        ajax({
            url:requrl,
            method:"GET",
            callback:function(data,err){
                err || data.code == 500 
                ? com.tishi("Ajax Error")
                :(
                    data = JSON.parse(data),
                    addArticleDom.call(me,data.data.list,callback),
                    localStorage.setItem(me.XIAOLE_BLOG_ARTICLE + "page_" + me.obj.page,JSON.stringify(data.data.list)),
                    me.obj["count"] = data.data.count,
                    localStorage.setItem(me.XIAOLE_BLOG_ARTICLE_COUNT,data.data.count)
                );   
            }
        })
    }

    get_blog_category(callback){
        var me = this;
        var blog_category_li = this.blog_category.getElementsByTagName("li")[0];
        if(blog_category_li){
            callback && callback();
            return false
        }
        ajax({
            url:"/ajax/get_category",
            method:"GET",
            callback:function(data,err){
                data = JSON.parse(data);
                err || data.code == 500 
                ? tishi("Ajax Error") 
                : ( 
                    addCategoryDom.call(me,data.data),
                    localStorage.setItem(me.XIAOLE_BLOG_CATEGORY,JSON.stringify(data.data)),
                    callback && callback() 
                )
            }
        })
    }

}
function scroll_loaded_article(){
    var load_article_interval = setInterval(function(){
        if(!blog_obj.page){
            return
        }
        clearInterval(load_article_interval);
        let article_count = blog_obj.count || localStorage.getItem(XIAOLE_BLOG_ARTICLE_COUNT);
        let article_limit = blog_obj.limit;
        let pages = Math.ceil(article_count / article_limit);
        let page = blog_obj.page = blog_obj.page + 1;
        if(page > pages){
            return
        }
        new Blog({
            page:page,
            limit:15
        }).isclearHTML = false;;
    },10)
}

function blogListener(){
    var ClientH = document.documentElement.clientHeight;
    var bodyH = document.body.clientHeight;
    var bodyScrollH = document.body.scrollTop || window.pageYOffset ||document.documentElement.scrollTop;
    (ClientH + bodyScrollH) == bodyH && scroll_loaded_article();
}

module.exports = {
    Blog,
    blogListener
}