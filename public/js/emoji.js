import com from "./com.js";
import temps from "./temps.js";


var emojisObj = {
    	"[:微笑:]":`<span class="emoji smile"></span>`,
    	"[:皱眉:]":`<span class="emoji frown"></span>`,
    	"[:吐舌头:]":`<span class="emoji tongue"></span>`,
    	"[:鬼脸:]":`<span class="emoji grimace"></span>`,
    	"[:难过:]":`<span class="emoji sorry"></span>`,
    	"[:斜眼看:]":`<span class="emoji leeringly"></span>`,
    	"[:大笑:]":`<span class="emoji Laugh"></span>`,
    	"[:眩晕:]":`<span class="emoji vertigo"></span>`,
    	"[:发怒:]":`<span class="emoji anger"></span>`,
    	"[:哭:]":`<span class="emoji cry"></span>`,
    	"[:大哭:]":`<span class="emoji crying"></span>`,
    	"[:流泪:]":`<span class="emoji tears"></span>`,
    	"[:看岔眼:]":`<span class="emoji cross"></span>`,
    	"[:色眯眯:]":`<span class="emoji mimi"></span>`,
    	"[:脏:]":`<span class="emoji dirty"></span>`,
    	"[:惊讶:]":`<span class="emoji surprise"></span>`,
    	"[:闭嘴:]":`<span class="emoji shutup"></span>`,
    	"[:受伤:]":`<span class="emoji injured"></span>`,
    	"[:右哼哼:]":`<span class="emoji righthum"></span>`,
    	"[:酷:]":`<span class="emoji cool"></span>`,
    	"[:吊炸天:]":`<span class="emoji fried"></span>`,
    	"[:呛水:]":`<span class="emoji suffer"></span>`,
    	"[:可怜:]":`<span class="emoji poor"></span>`,
    	"[:帅:]":`<span class="emoji handsome"></span>`
    }

    function emojiInsert(self){
        var emojiName = self.parentNode.getAttribute("title");
        var luValue = com.findParent(self,"lyDv").getElementsByClassName("lyValue")[0];;
        var cursurPosition = luValue.selectionStart;
        var ValueArr = luValue.value.split("");
        ValueArr.splice(cursurPosition,0,"[:"+emojiName+":]");
        var valueStr =  String(ValueArr).replace(/,/g,"");
        luValue.focus();
        luValue.value = valueStr;
    }

    function emojiEReplace(value){ //[:b:] 替换成表情标签
        var regObj = /\[[^\]]+\]/g;
        var regV ;
        while ((regV = regObj.exec(value)) != null)  { //循环匹配内容中所有与正则匹配的内容 //不循环只匹配一次
            value = value.replace(regV,emojisObj[regV[0]]);
            regObj.lastIndex; //加上这个 下一次循环才会从 上一次匹配完的地方开始匹配  不加就会死循环 
        }
        return value
    }

    function emojiDReplace(value){//反替换成 [:b:] 
        if( !/<span class="emoji/g.test(value) ){
            return value
        }
        for(let k in emojisObj){
            if(value.indexOf(emojisObj[k]) != -1){
                var reg = new RegExp(emojisObj[k],"g");
                value = value.replace(reg,k);
            }
        }
        return value      
    }

    function emojisShow(me){
        //show 中再次调用hide 如果 e-icon 点击了第二次 直接hide show方法中后边的代码不执行
        if(!emojisHide(me)){
            let ev = window.event;
            var iconParent = com.findParent(me,"lyDv");
            var top = ev.clientY + 20;
            var Left = ev.clientX - 80;
            com.createElement("div",function(el){
                el.className = "emojis anima-k";
                el.innerHTML = temps.emojis;
                el.style.zIndex = 1;
                iconParent.appendChild(el)
            })
            var lyValue = me.parentNode.parentNode.parentNode.getElementsByClassName("lyValue")[0];
            lyValue.focus();          
        }  
    }

    function emojisHide(me){
        let this_emojis = com.findParent(me,"lyDv").getElementsByClassName("emojis")[0]
        if (this_emojis) {
            com.removeElement(this_emojis)
            return true
        }else{
            return false
        }
    }

module.exports = {
    emojiInsert,
    emojiEReplace,
    emojiDReplace,
    emojisHide,
    emojisShow
}