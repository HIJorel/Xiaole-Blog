function ajax(obj){
    if(obj.dataType === "jsonp"){
        jsonp.call(obj);
        return
    }
	var url = obj.url;
	var method = obj.method;
	var async = String(obj.async) == "undefined" ? true : obj.async;
	var callback = obj.callback;
	var dataType = obj.dataType || "text";
    var contentType = obj.contentType;
    var processData = obj.processData;
    var data = obj.data;
    typeof processData === "undefined" ? (data = JSON.stringify(data)) : data;
	var ajax;
	if(window.XMLHttpRequest){
		ajax = new XMLHttpRequest();
	}else{
        ajax = new ActiveXObject("Microsoft.XMLHTTP");
    }
	if(ajax == null){
		console.log("XMLHttpRequest 对象为空！");
        return
	}
    ajax.open(method,url,async);
    ajax.responseType = dataType;


    typeof contentType === "undefined" ? (method == "POST" 
    ? ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=UTF-8")
    : ajax.setRequestHeader('Content-Type', 'application/json')) : contentType

    ajax.onreadystatechange = function(){
        
    	if(ajax.readyState == 4){
            if(ajax.status >= 200 && ajax.status < 400){
                var data = ajax.responseText;
                callback && callback(data,null);
            }else{
    		    callback && callback(null,"服务器错误");
            }
    	}
    	
    }
    ajax.onerror = function(){
    	callback && callback(null,"ajax error");
    }
    !data ? ajax.send() : ajax.send(data);
}



function jsonp(){
    if(this.method === "GET"){
        var script =  document.createElement("script");
        window[jsonpCallbackName] = function(data){
            this.callback && this.callback(data,null);
        };
        script.src = this.url + "?callback="+this.jsonpCallbackName;
        document.body.appendChild(script);
        setTimeout(function(){
            document.body.removeChild(script);
            script = null;
            window[jsonpCallbackName] = null;
        },500)
        return
    }else if( this.method === "POST"){
        var form = document.createElement("form");
        var iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.name = "iframe_target";
        form.action = this.url;
        form.target = "iframe_target";
        form.method = "post";
        document.body.appendChild(form);
        document.body.appendChild(iframe);
        if(this.data){
            var text = document.createElement("input");
            text.type = "text";
            text.name = "data";
            text.value = this.data;
            form.appendChild(text);
        } 
        form.submit();
        setTimeout(function(){
            document.body.removeChild(form);
            document.body.removeChild(iframe);
            form = null;
            iframe = null;
        },200)

    }
   
}
module.exports = ajax;
/*
function jsonp(data){
console.log(data)
}
var script = document.createElement("script");
script.src = 'https://api.weibo.com/2/users/show.json?callback=jsonp';
document.body.appendChild(script)
*/
//https://api.weibo.com/oauth2/access_token?client_id=1263376281&client_secret=ac8eb4c696aadeb1d218cf929bb0537c&grant_type=authorization_code&code=b6bb85964c2fdcf1d6c3331ee046c9bd&redirect_uri=http://axiaole.com
//https://api.weibo.com/oauth2/authorize?client_id=1263376281&redirect_uri=http://axiaole.com

//sinaSSOController.preloginCallBack({"retcode":0,"servertime":1505879090,"pcid":"tc-b3a21de67c0666869e6d40a38ea13cfd3d90","nonce":"KQI1N5","pubkey":"EB2A38568661887FA180BDDB5CABD5F21C7BFD59C090CB2D245A87AC253062882729293E5506350508E7F9AA3BB77F4333231490F915F6D63C55FE2F08A49B353F444AD3993CACC02DB784ABBB8E42A9B1BBFFFB38BE18D78E87A0E41B9B8F73A928EE0CCEE1F6739884B9777E4FE9E88A1BBE495927AC4A799B3181D6442443","rsakv":"1330428213","is_openlock":0,"lm":1,"smsurl":"https:\/\/login.sina.com.cn\/sso\/msglogin?entry=openapi&mobile=15986825260&s=d27e034d40bf24c77e9be1bc74123c28","showpin":0,"exectime":11})
//2.00RU5toFnszU4B864d3dbcb239Nf8D

//var bb = "ALC=ac%3D2%26bt%3D1505894447%26cv%3D5.0%26et%3D1537430447%26ic%3D707919102%26scf%3D%26uid%3D5332683133%26vf%3D0%26vs%3D0%26vt%3D0%26es%3Dd3f3eceb334279add0c5e8ef9a6f0a83; expires=Thursday, 20-Sep-2018 08:00:47 GMT; path=/; domain=login.sina.com.cn; tgc=TGT-NTMzMjY4MzEzMw==-1505894447-tc-7AA43A7DB42E3269B6CBACE895586A3F-1; domain=login.sina.com.cn; path=/; SUB=_2A250xlB_DeRhGeNN6FAX-C3NyD-IHXVXssa3rDV_PUNbm9AKLXGskW8pt8OSclhPWytWDSME1gdCmu1vGQ..; Path=/; Domain=.sina.com.cn; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9Wh7RKvl7w6s20iyBbFWiDx65NHD95Qfe0eESon0eKe0Ws4Dqcjci--fi-z7iKysi--Xi-z4iK.7i--fiKy2iKLWi--fi-88i-2Ei--Ni-8FiK.4i--4iK.fi-is; path=/; domain=.sina.com.cn; SCF=AliQn_SKiwSZeUS9F_ANuqbJamL47LAw3Q5jxIqxrJFcHptOX7bNNs3FfE6qa6nrffRIXOddiranSYtQi5zyXO0.; expires=Saturday, 18-Sep-2027 08:00:47 GMT; path=/; domain=.sina.com.cn; ALF=1537430447; expires=Thursday, 20-Sep-2018 08:00:47 GMT; path=/; domain=.sina.com.cn; LT=1505894447; path=/; domain=login.sina.com.cn; sso_info=v02m6alo5qztKWRk5SlkKOApY6EmKWRk5ClkKOkpY6TgKWRk5SljoSQpY6UhKWRk5SlkJSUpZCTiKWRk5ylkJSIpY6TpKWRk6SljpOUpZCkmKadlqWkj5OUs4yziLaOg4yxjLOMwA==; expires=Thursday, 20-Sep-2018 08:00:47 GMT; path=/; domain=.sina.com.cn".split("; ")

/*for(let i = 0;i<bb.length;i++){

document.cookie = bb[i]
}
*/
