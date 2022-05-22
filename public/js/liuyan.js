import com from "./com.js";
import ajax from "./ajax.js";
import temps from "./temps.js";
import getweiboinfo from "./getweiboinfo.js";
import { emojiInsert , emojiEReplace , emojiDReplace , emojisHide , emojisShow } from "./emoji.js";

let pop = com.getClass("pop")[0];


let getWeibo = function(callback){
	getweiboinfo(function(err,data){
		if(err){
			return
		}
		let weibodata = JSON.parse(data).weiboinfo;
		localStorage.setItem("weibo_info",JSON.stringify(weibodata));
		callback && callback(weibodata);
	})
}

let weiboInfoHtml = function(guanzhuNum,fensiNum,weiboNum){
	return`
		<div>
	        <strong>${guanzhuNum}</strong>
	        <span>关注</span>
	    </div>
	    <div>
	        <strong>${fensiNum}</strong>
	        <span>粉丝</span>
	    </div>
	    <div>
	        <strong>${weiboNum}</strong>
	        <span>微博</span>
	    </div>
	`
}

let setWeiboInfo = function(){
	let weibodata = JSON.parse(localStorage.getItem("weibo_info"));
	let setInfo = function(weibodata){
		com.getClass("wbCount")[0].innerHTML = weiboInfoHtml(weibodata.friends_count,weibodata.followers_count,weibodata.statuses_count);
		com.getClass("wbLogo")[0].getElementsByTagName("img")[0].src = weibodata.profile_image_url;	
		com.getClass("wbBody")[0].getElementsByTagName("a")[0].href = "http://weibo.com/xiaolebk"; 
		com.getClass("wbBody")[0].getElementsByTagName("a")[0].setAttribute("target","__blank");
	}
	if(!weibodata){
		getWeibo(function(data){
			weibodata = data;
			setInfo(weibodata);
		})	
		return
	}	
	setInfo(weibodata);
}

let __liuyanHTML = function(data){
	return`
		<div class="lyContList">
            <div class="lyContInfo">${emojiEReplace(data.hf_content)}<span class="ly-Content">${emojiEReplace(com.HTMLEncode(data.content))}</span></div>
            <div class="lyContAuthor">
                <img src="" alt="">
                <a href="javascript:;" class="ly-author">${data.author}</a>
            </div>
            <div class="lyContTime">
                <div class="time">${com.date(data.time,"Y M-D")}</div>
                <a href="javascript:;" class="lyContReq" data-name=${data.author} data-maill=${data.maill ? data.maill : ""}>回复</a>
            </div>
            <div class="lyContJ"></div>
        </div>
	`
}

let __newLiuyanHTML = function(data){
	return`
		<li>
            <a href="javascript:;" class="lyClick">
                <div class="lyContHead">
                    <img src="" alt="">
                </div>
                <div class="lyCont">
                    <h4><span class="ly-author">${data.author} </span><span>${com.date(data.time,"Y M-D")}</span></h4>
                    <p>${emojiEReplace(com.HTMLEncode(data.content))}</p>
                </div>
            </a>
        </li>
	`
}

let __commentsHTML = function(obj){
	return`
		<div class="lyContInfo">${obj.hf_content?obj.hf_content:""}<span class="ly-Content">${obj.value}</span></div>
		<div class="lyContAuthor">
			<img src="" alt="">
			<a href="javascript:;" class="ly-author">${obj.Name}</a>
		</div>
		<div class="lyContTime">
			<div class="time">刚刚</div>
			<a href="javascript:;" class="lyContReq" data-name=${obj.Name}>回复</a>
		</div>
		<div class="lyContJ"></div>
	`
}

let __setCommentInfo = function(){
    if (com.getClass("lyName")[0]) {               
        var cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            var name = cookies[i].split("=");
            for (let b = 0; b < name.length; b++) {
                if(name[b].replace(/\s/,"") == "value"){ 
                    var value = cookies[i].split("=");
                    value = value[1].split("|");
                    var lyName = com.getClass("lyName");
                    lyName[0].setAttribute("data-name",value[0]);
                    lyName[0].setAttribute("data-maill",value[1]);
                    lyName[0].setAttribute("data-blogUrl",value[2]);
                    lyName[0].innerHTML = value[0];            
                }
            }       
        }
    }       
}


let __pagination = function(data){
	let count = data.data.count;
	let pages = Math.ceil(count / Number(this.limit));
	let paginationTemp = "";
	const pageDomNum = 5; //几个翻页dom 元素

	if(pages <= 1){
        return
    }
	
    let g = 0,len = pages > pageDomNum ? pageDomNum : pages;
    if(Number(this.page) > 4){
    	len = Number(this.page) + 2 ;
    	len > pages ? len = pages : len;
    	g = len > pageDomNum ? (len - pageDomNum) : g;
    } 
    
    for ( g ; g < len; g++) {
        if( g == (this.page - 1) ){
            paginationTemp += `<li><span class="active page">${g+1}</span></li>`;
        }else{
            paginationTemp += `<li><a href="javascript:;" class="pagination_ page">${g+1}</a></li>`;
        }
    }

    let pagination = `<ul><li><a href="javascript:;" class="pagination_prev page">上一页</a></li>${paginationTemp}<li><a href="javascript:;" class="pagination_next page">下一页</a></li></ul>`  
    return pagination;
}


let __addNewLiuyanTemp = function(data){
	com.getClass("lyNewlist")[0].innerHTML = data;
			
}

let __addLiuyanTemp = function(data){
	com.getClass("lyContLists")[0].innerHTML = data;
}

let __addPaginationTemp = function(data){
	com.getClass("ly-pagination")[0].innerHTML = data;
}

let __zuZhuangDom = function(list){
	let newLiuyan = "";
	let liuyanBody = "";
	for (var i = 0; i < list.length; i++) {
		liuyanBody += __liuyanHTML(list[i]);
		if( this.defaults == 1 && i < 8 && !this.isArticle){
			newLiuyan += __newLiuyanHTML(list[i]);
		}
	}
	return {
		liuyanBody,
		newLiuyan
	}
}

let __LiuyanDom = function(data){
	let me =this;
	let jsonData = __zuZhuangDom.call(me,data.data.list);
	let pagination = __pagination.call(me,data);

	setTimeout(function(){
		!me.isArticle && (!com.getClass("liuyan")[0] && (document.getElementsByClassName("page")[0].innerHTML = temps.lybody));   
		__setCommentInfo(); 
		jsonData.liuyanBody ? __addLiuyanTemp(jsonData.liuyanBody) : __addLiuyanTemp("<div class='blank_comments'>沙发没人哦</div>");
		jsonData.newLiuyan && __addNewLiuyanTemp(jsonData.newLiuyan);
		!me.isArticle && setWeiboInfo();
		pagination && __addPaginationTemp(pagination);
	},270)
}

let __getAttr = function(clickTarget){
	let lyDv = com.findParent(clickTarget,"lyDv");
	let lyValue = lyDv.getElementsByClassName("lyValue")[0];
    let lyName = lyDv.getElementsByClassName("lyName")[0];
    let Name = lyName.getAttribute("data-name");
    let Maill = lyName.getAttribute("data-maill");
    let blogUrl = lyName.getAttribute("data-blogurl");
 	let value = lyValue.value;
 	let lyLists = com.getClass("lyContLists")[0];
	let lyList = com.getClass("lyContList")[0];
	let lyZj = com.getClass("lyZj")[0];
	let blank = com.getClass("blank_comments")[0];
	return{
		lyDv,
		lyValue,
        lyName,
        Name,
        Maill,
        blogUrl,
     	value,
     	lyLists,
		lyList,
		lyZj,
		blank,
		clickTarget  
	}
}

let setTx = function(){
	var lyName = com.getClass("lyName")[0];
	var Name = lyName.getAttribute("data-name");
	var Maill = lyName.getAttribute("data-maill");
	var blogUrl = lyName.getAttribute("data-blogUrl");
	var pop_setInfoTemp = `
	 <h3>请设置资料<a class="closeImg set-toux-close" href="javascript:;"></a></h3>
	 <div class="set-toux-ipt">
	 	<input type="text" placeholder="你的昵称" value="${Name || ""}">
	 	<input type="text" placeholder="你的邮箱" value=${Maill || ""}>
	 	<input type="text" placeholder="你的博客网址" value=${blogUrl || ""}>
	 </div>
	 <div class="set-toux-but">
	 	<div>
	 		<a href="javascript:;" class="set-toux-ok">确定</a>
	 		<a href="javascript:;" class="set-toux-close">取消</a>
	 	</div>
	 </div>
`
    com.createElement("div",(el)=>{
    	el.className = "set-toux";
    	el.innerHTML = pop_setInfoTemp;
    	pop.appendChild(el);
    	let center = com.elCenter("set-toux");
	    com.setStyle({
	    	"el":"set-toux",
	    	"style":{
	    		"zIndex":backNum,
	    		"top":center.top + "px",
	    		"left":center.left + "px",
	    		"transition":"all 0.1s ease",
	    		"transform":"translateY(20px)"
	    	}
	    })
    });
}

let insertCommentsDom = function(attr){
	let value =  com.HTMLEncode(attr.value);// 替换emojis前 看下用户是否输入了 html标签 有的话 则执行编码
        value = emojiEReplace(value);//替换emoji 标签
	var commentsHtml = __commentsHTML({
		value:value,
		Name:attr.Name,
		hf_content:attr.hf_content
	});
	com.createElement("div",(el)=>{
		attr.lyValue.value = "";
 		el.className = "lyContList ly-anima";
 		el.innerHTML = commentsHtml;
 		attr.lyLists.insertBefore(el,attr.lyList);
 	});
}


let zjIsExists = function(attr){
	emojisHide(attr.clickTarget);
	attr.lyZj && (
		pop.removeChild(attr.lyZj),
	    com.background("off")
	);			
    attr.blank && attr.lyLists.removeChild(attr.blank);              
}

let __Loading = function(attr){
	let addliuyan_loading = `<div class="load-anima"></div>`;	
	com.createElement("div",(el)=>{
    	el.className = "load";
    	el.innerHTML = addliuyan_loading;
    	attr.lyLists.insertBefore(el,attr.lyList);
    	attr["loading"] = el;
    });
}

let __addData = function(attr,callback){ //全局变量 dataValue 收录 被回复的内容 以便在发表时添加 到 hf-css 那个dom中
	attr["hf_content"] = dataValue ? `<div class='hf-css'>${dataValue}</div>` : ""
	__Loading(attr);
	zjIsExists(attr);
    this.addCommentsHttp(attr,(data,err)=>{
    	data = JSON.parse(data);
        if( err || data.code == 500 ){
        	com.tishi("发布失败 Error:500");
        	return
        }
        callback && callback();
    })
}

let Comments_isNext = function(attr){
	var me = this;
	if(!com.getClass("lyName")[0].getAttribute("data-name")){
		com.background("on");
		setTx();
		return false
	}
	if(!attr.value){
		com.tishi("你倒是写点啥呀!");
		return false
	}
	__addData.call(me,attr,()=>{
		
     	attr.lyLists.removeChild(attr.loading);
     	insertCommentsDom && insertCommentsDom(attr);
     	setTimeout(function(){
     		com.tishi("发布成功");
     	},200)
	})
}
			
class Liuyan{
	constructor(obj){
		this.blogArticleId = obj.blogArticleId || "default";
		this.isArticle = obj.isArticle || false;
		this.defaults =  typeof obj.defaults == "undefined" ? 1 : obj.defaults;
		this.page = obj.page || 1;
		this.limit = obj.limit || 10;
		obj.title ? document.title = obj.title : null;
	}

	getCommentsDom(){
		let me =this;
		this.http((data)=>{
			__LiuyanDom.call(me,data);
		})
	}



	addCommentsDom(clickTarget){
		/*emojisHide(clickTarget);*/
        let attr = __getAttr(clickTarget);
    	Comments_isNext.call(this,attr);   
	}

	addCommentsHttp(attr,callback){
		var me = this;
		ajax({
            url:"/comments/add",
            method:"POST",
            async:true,
            dataType:"text",
            data:{
                cid:me.blogArticleId,
                author:attr.Name,
                content:attr.value,
                hf_content:com.HTMLDecode(emojiDReplace(attr.hf_content)),//将emojis 标签 替换成 [:name:] 存数据库
                maill:attr.Maill,
                blogurl:attr.blogUrl
            },
            callback:callback
        })
	}

	http(callback){
		ajax({
            url:"/liuyan/get_lylist?cid="+ this.blogArticleId  + "&page=" + this.page +"&limit="+ this.limit,
            method:"GET",
            async:true,
            dataType:"text",
            callback:function(data,err){
                data = JSON.parse(data);
                err || data.code == 500 
                ? com.tishi("Ajax Error")
                : (
                	callback && callback(data)
                )
            }
        })
	}
}


module.exports = {
	Liuyan,
	setTx
};
