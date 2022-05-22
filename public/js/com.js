var eventStack = {};//eventStack

function eventFn(e){          	
	var me = this;
    for(let el = e.target; el != document; el = el.parentNode){
        var elArr = [];  
        var classname =  el.className;
        if(typeof classname == "string" && classname.indexOf(" ") != -1 ){
            let elClass = el.className.split(" ");
            elClass.forEach(function(v,i,arr){
                elArr.push("." + v);
            })
            el.id && elArr.push("#" + el.id);
            elArr.push(el.tagName.toLowerCase());
        }else{
            el.className && elArr.push("." + el.className);
            el.id && elArr.push("#" + el.id);
            elArr.push(el.tagName.toLowerCase());
        }
        for(let i = 0; i<elArr.length; i++){
            for(var ev in eventStack){
                if(e.type == ev){
                    if(elArr[i] in eventStack[ev]){
                        if(me == eventStack[ev][elArr[i]]["fel"]){
                            for(let k in eventStack[ev][elArr[i]]["callback"]){
                                eventStack[ev][elArr[i]]["callback"][k](e,el);
                            }
                            return false
                        }
                    }
                }
            }
        }
    }                           
}

//# . 返回id || class
function returnElType(el){
    if(/^#.+/.test(el)){
        return "id";
    }else if(/^\..+/.test(el)){
        return "class";
    }else{
        return "tag";
    }
}

var util = {
    getId:function(name){
        return document.getElementById(name);
    },
    getClass:function(name){
        return document.getElementsByClassName(name);
    },
    getTag:function(name){
        return document.getElementsByTagName(name);
    },
    getDom:function(el){
        var elType = returnElType(el);
        switch(elType) {
            case "class":
                return this.getClass(el.replace(".",""));
                break;
            case "id":
                return this.getId(el.replace("#",""));
                break;
            default :
                return this.getTag(el);
        }
    },
	on:function(param){
		var el = param.el,
            fel = param.fel || null,
            event = param.event || "click",
            callback = param.callback;
            callback || console.error("document 节点 " + el + " 未传入回调函数");
        eventStack[event] = eventStack[event] || {};
        eventStack[event][el] = eventStack[event][el] || {};
        eventStack[event][el]["fel"] = fel ? this.getEl(fel)[0] : document;
        eventStack[event][el]["callback"] = eventStack[event][el]["callback"] || {};
        eventStack[event][el]["callback"][callback.name == "callback" ? ("callback_" + parseInt(Math.random() * 10000) + (+new Date()).toString()) : callback.name] = callback;
        fel ? ((typeof fel == "string") 
            ? this.getEl(fel)[0].addEventListener(event,eventFn,false)
            : fel.addEventListener(event,eventFn,false))
            : document.addEventListener(event,eventFn,false);

        return this
	},
	off:function(el,event,funName){
		delete eventStack[event][el]["callback"][funName];
        return this
	},
	date:function(s,type){
        var dayObj = {
            "1":"星期一",
            "2":"星期二",
            "3":"星期三",
            "4":"星期四",
            "5":"星期五",
            "6":"星期六",
            "7":"星期日"
        }
        var date = new Date(Number(s));
        var timeObj = {
            "Y":date.getFullYear(),
            "M":date.getMonth() + 1,
            "D":date.getDate(),
            "h":date.getHours(),
            "m":date.getMinutes(),
            "s":date.getSeconds(),
            "d":dayObj[date.getDay()]
        }
        
        for(let k in timeObj){
            type = type.replace(k,timeObj[k])
        }
        return type
     
    },
    createElement:function(elName,callback){
        var el = document.createElement(elName);
        callback && callback(el);
    },
    removeElement:function(delEl){
    	typeof delEl == "string" 
    	?  this.getClass(delEl)[0].parentNode.removeChild(this.getClass(delEl)[0])
    	:  delEl.parentNode.removeChild(delEl) 
    },
    tishi:function(tishi,el){
    	let dom = el ? this.getClass(el)[0] : this.getClass("pop")[0];
        if(this.getClass("tishi")[0]){
            return
        }
        var me = this;
		this.createElement("div",function(el){
			el.className = "tishi";
			el.innerHTML = tishi;
			dom.appendChild(el);
			var center = me.elCenter("tishi");
			me.setStyle({
				"el":"tishi",
				"style":{
					"zIndex":"100",
					"left":center.left + "px",
					"top":center.top + "px",
					"transition":"all 0.1s",
					"transform":"translateY(20px)"
				}
			})
			setTimeout(function(){
				me.setStyle({
	    			"el":"tishi",
	    			"style":{
	    				"transform":"translateY(0px)"
	    			}
	    		})
	    		setTimeout(function(){
	    			dom.removeChild(el);
	    		},100)
				
			},2000)
		});
	},
	setStyle:function(obj){
        var el = this.getClass(obj.el)[0];
        var k = Object.keys(obj.style);

        for (var i = 0; i < k.length; i++) {
        	el.style[k[i]] = obj.style[k[i]];
        	// console.log(k[i] +"============"+obj.style[k[i]])
        }
    },
     //获取元素的居中值
    elCenter:function(name){
    	var el = this.getClass(name)[0];
        var bodyWcenter = document.documentElement.clientWidth/2;
        var bodyHcenter = document.documentElement.clientHeight/2;
        var elHcenter = el.offsetHeight/2;
        var elWcenter = el.offsetWidth/2;
        var left = bodyWcenter - elWcenter;
        var top = bodyHcenter - elHcenter;
        return {
        	left,
        	top
        }
    },
    HTMLEncode:function(html){
        if(!/<[^>]+>/.test(html)){
           return html
        }
        var temp = document.getElementById("htmlcode");
        ! temp.textContent 
        ? temp.innerText = html
        : temp.textContent = html;
        var text = temp.innerHTML;
        return text
    },

    HTMLDecode:function(text){ //专门针对标签的
        if( text.indexOf("&lt;") == -1
        &&  text.indexOf("&gt;") == -1){
            return text
        }
        /*var temp = document.getElementById("temp");
        temp.innerHTML = text;
        var html = temp.innerText;*/
        text = text.replace(/&lt;/g,"<");
        text = text.replace(/&gt;/g,">");
        return text
    },
    findParent:function(cel,felClass){
    	let el = cel;
    	while(el.className != felClass){
    		el = el.parentNode
    	}
    	return el
    },
    // 背景层
    background:function(kaiguan,s){
        var back = this.getClass("background")[0];
     	if( kaiguan == "off"){
     		backNum --;
         	back.style.transition = "all " + (s ? s + "s" : "0.2s") + " ease";
            back.style.WebkitTransition = "all " + (s ? s + "s" : "0.2s") + " ease";
         	back.style.opacity = back.style.zIndex == 1  ? "0" : "0.6";     
         	setTimeout(function(){
         		back.style.zIndex = !backNum  ? -1  : backNum;
                back.style.display = !backNum  ? "none" : "block";
         	},s ? s *1000 : 200);   	
     	}else{
            backNum++;
            back.style.display = "block";
            back.style.zIndex = 0 + backNum;
            setTimeout(function(){
                back.style.transition = "all " + (s ? s + "s" : "0.2s")+ " ease";
                back.style.WebkitTransition = "all " + (s ? s + "s" : "0.2s")+ " ease";
                back.style.opacity = "0.6";  
            },50)        	
     	}
    }
}

 module.exports = util 

