import com from "./com.js";
import ajax from "./ajax.js";
import temps from "./temps.js";


let __linkHTML = function(data){
	return `
		<li>
            <div class="link-animation">
                <div class="link-cont">
                    <a href="${data.url}">
                        <h3>
                            <img src="${data.url}/favicon.ico">
                            <span>${data.name}</span>
                        </h3>
                        <p>${data.description}</p>
                    </a>
                </div>
            </div>
        </li>
	`
}

let __addLinkTemp = function(linkTemp){
	setTimeout(function(){
		!com.getClass("link")[0] && (document.getElementsByClassName("page")[0].innerHTML = temps.link);
		document.getElementsByClassName("link-list-ul")[0].innerHTML = linkTemp;
	},270)
}


class Link{
	constructor(obj){
		this.addDom();
		obj.title && (document.title = obj.title);
	}

	addDom(){
		this.http((data)=>{
			let list = data.data;
			let linkTemp = "";
	        for(let i = 0;i<list.length;i++){
	            linkTemp += __linkHTML(list[i]);
	        }
	        __addLinkTemp(linkTemp);
		})
	}

	http(callback){
		var me = this;
		ajax({
            url:"/ajax/link/get_linklist?page=1&limit=8",
            method:"GET",
            async:true,
            dataType:"text",
            callback:function(data,err){
                var linkTemp =  "";
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

module.exports = Link;