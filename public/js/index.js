

    "use strict"
    import "../css/style.css";
    import com from "./com.js";
    import ajax from "./ajax.js";
    import temps from "./temps.js";
    import routers from "./routers.js";
    import {Blog,blogListener} from "./blog.js";
    import Link from "./link.js";
    import { Liuyan , setTx } from "./liuyan.js";
    import { emojiInsert , emojiEReplace , emojiDReplace , emojisHide , emojisShow } from "./emoji.js";
    import pb from "./pb.js";
    /*var createNum = 0;*/
    window.backNum  = 0;
    //手机端
    let navBtn = com.getClass("nav-btn")[0];
    let nav = com.getClass("nav")[0];
    let ul = nav.getElementsByTagName("ul")[0];
    let navClassName = nav.className;
    let pop = com.getClass("pop")[0];

    var loadingStart = false; //loading 加载动画 默认不开启 : 刷新页面不要执行loading 加载动画 而是网站打开时的动画(开场动画)
    var blogArticleId = null;
    var isArticle = false;

    function scrollObj(){
        if(document.documentElement.scrollTop){
            return document.documentElement
        }else if(window.pageYOffset){
            return document.body
        }else{
            return document.body
        }
    }

    routers.init()
    .beforeHandle(function(){
        if(!loadingStart){ // false 时 (就是刷新页面时) 不执行loading 而是执行 start_animation
            start_animation();
            loadingStart = true; //之后赋值为 true 后边的 ajax 路由切换 则执行 loading 
        }else{
            loading();
        }
        window.removeEventListener("scroll",blogListener);
    })
    .register("/",function(){
        document.title = "小乐博客";
        setTimeout(function(){
            !com.getClass("page_index")[0] && (document.getElementsByClassName("page")[0].innerHTML = temps.index);
        },240)
    })
    .register("/liuyan",function(){
        new Liuyan({
            title:"留言板-小乐博客",
        }).getCommentsDom()
    })
    .register("/blog",function(){
        new Blog({
            page:1,
            limit:15,
            title:"博客-小乐博客"
        })
    })
    .register("/link",function(){
        new Link({
            title:"友情链接-小乐博客"
        })
    })
    .register("/blog/{id}",function(id){
        ajax({
            url:"/ajax/blog/"+id,
            method:"GET",
            async:true,
            dataType:"text",
            callback:function(data,err){
                data = JSON.parse(data);
                if(err || data.code == 500){
                    com.tishi("出错咯！请检查你的网络是否正常");
                    return
                }
                document.title = data.data.title + "-小乐博客";
                blogArticleId = id;
                isArticle = true;
                setTimeout(function(){
                    com.getClass("page")[0].innerHTML = temps.article_content;
                    let article_content_Temp = `<div class="article_cont">${data.data.content}</div>`
                    com.getClass("article_title")[0].innerHTML = data.data.title;
                    com.getClass("article_header")[0].style.backgroundImage = `url(${data.data.imgpath && data.data.imgpath.replace("build","").replace(/\\/g,"/")})`;
                    com.getClass("article_body")[0].innerHTML = article_content_Temp;
                },270)
                new Liuyan({
                    defaults:0,
                    isArticle:true,
                    blogArticleId:id
                }).getCommentsDom()
            }
        })
    })
    .register("/blog/tag/{tagname}",function(tagname){
        new Blog({
            page:1,
            limit:15,
            tag:tagname,
            title:tagname + "-小乐博客"
        })
    })
    .register("/blog/category/{name}",function(name){
        new Blog({
            page:1,
            limit:15,
            category:name,
            title:name + "-小乐博客"
        })
    })


    window.addEventListener("resize",resize_Fn);  
     
    function resize_Fn(){
        if(com.getClass("blog")[0]){
            pb();
        }
        ["set-toux","lyZj","link-setzl"].forEach(function(v,k){
            if(com.getClass(v)[0]){
                resize_setCenterNum(v);
            }
        })
    }

    function resize_setCenterNum(el){
        var centerNum = com.elCenter(el);
        com.setStyle({
            el:el,
            style:{
                left:centerNum["left"]+"px",
                top:centerNum["top"]+"px"
            }
        })
    }


    {
        // scroll大于0 导航变成 白色 开始为透明
        window.addEventListener("scroll",scrollFn) 
        function scrollFn(){
            /*console.log(clasName)*/
            let body = document.body;
            let bodyClass = body.className;
            if(document.body.scrollTop > 0 || document.documentElement.scrollTop > 0){
                body.className = bodyClass.indexOf("on") == -1 ? bodyClass+" on" : bodyClass;
            }else{
                body.className = bodyClass.replace(" on","");
            }      
        }

    }

	//回顶部
    com.on({
        el:".tool-ding",
        fel:null,
        event:"click",
        callback:function(e,this_el){
            var topInter = setInterval(function(){
                scrollObj().scrollTop -= 60;
              
                if(scrollObj().scrollTop == 0 ){clearInterval(topInter)}
            },10)
        }
    });

    //loading
    function loading(){
        document.body.className = document.body.className + " loaded";
        com.background("on","0.5s");
        let loading = document.createElement("div");
        loading.className = "loading";
        loading.innerHTML = temps.loading;
        pop.appendChild(loading); 
        setTimeout(function(){
            pop.removeChild(loading); 
            document.body.className = document.body.className.replace(" loaded","");
            com.background("off","0.3s");
        },1500)
    }
  

    com.on({
        el:"a",
        fel:null,
        event:"click",
        callback:function(e,me){
            me.className == "nav_item" && navHide(nav);
           
                let url = me.getAttribute("href");
                if( routers.urlChange(url) ){
                    e = e || event;
                    e.preventDefault();
                    window.history.pushState(null,null,url);
                    scrollObj().scrollTop = 0;
                }
            
        }
    }).on({
        el:".nav-btn",
        fel:null,
        event:"click",
        callback:function(e,me){
            navShow(nav);
            com.on({
                el:"body",
                fel:null,
                event:"click",
                callback:offListenFun
            })
            function offListenFun(e,me){
                navHide(nav);
                com.off("body","click","offListenFun"); 
            }
        }
    })

    function navShow(nav){
        if(!navHide(nav)){
            document.body.className = document.body.className +" nav-opened";
        }
    }

    function navHide(nav){
        if(document.body.className.indexOf("nav-opened") != -1){
            document.body.className = document.body.className.replace(" nav-opened","");
            return true
        }else{
            return false
        }
    }


	//点击弹出背景 执行回调
	function clickTc(name,kaiguan,callback){
		var arr = name.split(" ");
		var len = arr.length;
		for (var i = 0; i < len; i++) {
            com.on({
                el:"."+arr[i],
                fel:null,
                event:"click",
                callback:function(e,me){
                    com.background(kaiguan);
                    if(callback){
                        callback(self);
                    }
                }
            })
		}	
	}
    
    

	clickTc("lytoux","on",function(){
		setTx();
	});
    window.dataValue = "";
    com.on({
        el:".lyContReq",
        fel:null,
        event:"click",
        callback:function(e,me){
            var self = me;
            com.background("on");
            var plName = self.getAttribute("data-name");
            var plvalue = self.parentNode.parentNode.getElementsByClassName("ly-Content")[0].innerHTML;
            var lyName = com.getClass("lyName")[0];
            var maill = lyName.getAttribute("data-maill");
            var blogUrl = lyName.getAttribute("data-blogUrl");
            var name = lyName.getAttribute("data-name");
            
            dataValue = `@<a href="javascript:;" class="ly-author">${plName}：</a>${plvalue}`;
            var str = `
                <div class="lyHf">
                        <div>回复：${plName}</div>
                        <a class="closeImg lyClose" href="javascript:;"></a>
                </div>
                <div class="lyDv">
                <div class="lytoux">
                    <div class="img"><img class="lySetTx" src="" alt=""></div>
                    <a href="javascript:;" class="lyName" data-name="${name}" data-blogUrl="${blogUrl}" data-maill="${maill}">${name ? name : "设置名称"}</a>
                </div>
                <div class="lyText">
                    <textarea class="lyValue" name="lyCont"></textarea>
                </div>
                <div class="lyFooter">
                    <div class="lyFooterLeft">
                                    <div class="e-icon"><span></span></div>
                                </div>
                    <div class="lyFooterRight">
                        <a href="javascript:;" class="ly-submit">发布</a>
                    </div>
                </div></div>`

            pop.appendChild(createEl("div","lyZj",str));;
            com.setStyle({
                "el":"lyZj",
                "style":{
                    "zIndex": backNum,
                    "position":"fixed"
                }
            });
            stylee("lyZj",'20px');
        }
    })

    com.on({
        el:".link-up",
        fel:null,
        event:"click",
        callback:function(e,me){
            com.background("on");
            var str = `
             <h3>请设置资料<a class="closeImg link-close" href="javascript:;"></a></h3>
             <div class="link-ipt">
                <input type="text" placeholder="你的昵称">
                <input type="text" placeholder="你的邮箱">
                <input type="text" placeholder="你的博客地址">
                <textarea placeholder="个人描述"></textarea>
             </div>
             <div class="link-but">
                <div>
                    <a href="javascript:;" class="link-ok">确定</a>
                    <a href="javascript:;" class="link-close">取消</a>
                </div>
             </div>
             `
            pop.appendChild(createEl("div","link-setzl",str));;
            
            com.setStyle({
                "el":"link-setzl",
                "style":{
                    "zIndex": backNum,
                    "position":"fixed"
                }
            });
            stylee("link-setzl",'20px');
        }
    }).on({
        el:".link-ok",
        fel:null,
        event:"click",
        callback:function(e,me){
            var linkSetzl = com.findParent(me,"link-setzl");
            var input = linkSetzl.getElementsByTagName('input');
            var textarea = linkSetzl.getElementsByTagName('textarea')[0];
            !input[0].value
            ? com.tishi("昵称不能为空哦！") 
            : !input[1] .value
            ? com.tishi("你的邮箱是什么呢？")
            : !input[2].value
            ? com.tishi("你的博客地址呢？")
            : !textarea.value
            ? com.tishi("请用一句话描述自己哦！")
            : 
            (com.background("off"),
            setTimeout(function(){
                pop.removeChild(linkSetzl);
            },80),
            ajax({
                url:"/ajax/addlink",
                method:"POST",
                async:true,
                dataType:"text",
                data:{
                    name:input[0].value,
                    maill:input[1] .value,
                    url:findUrlIsHttp(input[2].value),
                    description:textarea.value
                },
                callback:function(data,err){
                    data = JSON.parse(data);
                    err ? com.tishi("服务器错误") : data.code == 200 ? com.tishi("添加成功，请等待审核。") : com.tishi("服务器错误")
                }
            }))
        }
    })

    //是否包含 http://  没有则添加
    function findUrlIsHttp(url){
        url.indexOf("http://") != -1 
        ? url 
        : url.indexOf("https://") != -1 
        ? url 
        : url = "http://" + url
        return url
    }

	clickTc("set-toux-close","off",function(){
		removeEl("set-toux");
	});

	clickTc("lyClose","off",function(){
        dataValue = "";
		removeEl("lyZj");
	});

	clickTc("link-close","off",function(){
		removeEl("link-setzl");
	});
    
    /*clickTc("set-toux-ok","off",function(){
    	
	});*/
    com.on({
        el:".set-toux-ok",
        fel:null,
        event:"click",
        callback:function(e,me){
            var ipts = com.getClass("set-toux-ipt")[0].getElementsByTagName("input");
            var lyName = com.getClass("lyName");
            if(!ipts[0].value){
                com.tishi("告诉我叫啥呗!")
                return
            }
            if(ipts[1].value){
                if(!(/^\w+\@{1}\w+\.{1}(com|cn|net|pw|cc)$/.test(ipts[1].value))){
                    com.tishi("邮箱格式不正确哦")
                    return
                } 
            }
            com.background("off");
            for (var i = 0; i < lyName.length; i++) {
                lyName[i].setAttribute("data-name",ipts[0].value);
                lyName[i].setAttribute("data-maill",ipts[1].value);
                lyName[i].setAttribute("data-blogUrl",ipts[2].value);
                lyName[i].innerHTML = ipts[0].value;
            }
            document.cookie = "value="+ipts[0].value+"|"+ipts[1].value+"|"+ipts[2].value + ";path=/";

            removeEl("set-toux");
        }
    })

    com.on({
        el:".pagination_prev",
        fel:null,
        event:"click",
        callback:function(e,me){
            var page = Number(com.findParent(me,"ly-pagination").getElementsByClassName("active")[0].innerText) - 1 ;
            if(page < 1){
                return false
            }
            new Liuyan({
                defaults:0,
                page:page,
                isArticle:isArticle,
                blogArticleId:blogArticleId
            }).getCommentsDom()
        }
    })
    .on({
        el:".pagination_next",
        fel:null,
        event:"click",
        callback:function(e,me){

            var lis = com.findParent(me,"ly-pagination").getElementsByClassName("page");
            var arr = [];
            for(let i=0;i<lis.length;i++){
                arr.push(lis[i])
            }
            var lastPage = Number(lis.length-2);
            var page = Number(com.findParent(me,"ly-pagination").getElementsByClassName("active")[0].innerText) + 1 ;
            var pageNum = arr.indexOf(com.findParent(me,"ly-pagination").getElementsByClassName("active")[0]);
            let bb = pageNum;
            if( pageNum == lastPage ){
                return
            }
            new Liuyan({
                defaults:0,
                page:page,
                isArticle:isArticle,
                blogArticleId:blogArticleId
            }).getCommentsDom()
        }
    })
    .on({
        el:".pagination_",
        fel:null,
        event:"click",
        callback:function(e,me){
            let page = Number(me.innerText);
            new Liuyan({
                defaults:0,
                page:page,
                isArticle:isArticle,
                blogArticleId:blogArticleId
            }).getCommentsDom()
        }
    })

    //临时公共函数
	function removeEl(el){
		com.setStyle({
            "el":el,
            "style":{
                "transform":"translateY(-40px)",
                "WebkitTransform":"translateY(-40px)"
            }
        })
		setTimeout(function(){
			pop.removeChild(com.getClass(el)[0]);
			/*com.getClass("background")[0].style.display = "none";*/
			/*createNum--;*/
		},90)
	}
    
    //发表留言 添加盒子 假象
    com.on({
        el:".ly-submit",
        fel:null,
        event:"click",
        callback:function(e,clickTarget){
            new Liuyan({
                defaults:0,
                isArticle:isArticle,
                blogArticleId:blogArticleId
            }).addCommentsDom(clickTarget);   
        }
    })

    com.on({
        el:".e-icon",
        fel:null,
        event:"click",
        callback:function(e,me){
            var that = me;
            emojisShow(me); 
            com.on({
                el:"body",
                fel:null,
                event:"click",
                callback:offListenFun
            })  
            function offListenFun(e,me){
                emojisHide(that);
                com.off("body","click","offListenFun"); 
            }  
        }
    })

    com.on({
        el:".emoji",
        fel:null,
        event:"click",
        callback:function(e,me){
            emojiInsert(me); 
        }
    })


    function stylee(el,value){	
        let centerNum = com.elCenter(el);
        com.setStyle({
            el:el,
            style:{
                "top":centerNum.top + "px",
                "left":centerNum.left + "px"
            }
        })
        setTimeout(function(){
            com.setStyle({
                "el":el,
                "style":{
                    "transition":"all 0.1s ease",
                    "WebkitTransition":"all 0.1s ease",
                    "transform":"translateY("+value+")",
                    "WebkitTransform":"translateY("+value+")"
                }
            })
        })
    }
    //"WebkitTransform":"translateY("+value+")", "WebkitTransition":"all 0.1s ease"

    // 创建元素 添加模板 元素设置class 添加到body
     
    function createEl(el,clas,temp){
    	/*createNum ++;*/ //记录添加次数 添加的时候肯定会打开背景层  计算 背景层的z-index
    	var div = document.createElement(el);
        div.className = clas;
        div.innerHTML = temp;
        return div
    }

    function start_animation(){
        console.log("开机动画还未设计 //")
    }

    //http://axiaole.com/?code=9de77dbba6ff74dfbf1d7c25c1de0f16
    //https://api.weibo.com/oauth2/access_token?client_id=1263376281&client_secret=ac8eb4c696aadeb1d218cf929bb0537c&grant_type=9de77dbba6ff74dfbf1d7c25c1de0f16