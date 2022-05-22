function cookie(cookieStr){
	var cookieObj = {};
	if(!cookieStr){
		return cookieObj
	}
    var cookies = cookieStr.split(";");
    for(let i=0;i<cookies.length;i++){
    	if(cookies[i] == ""){
    		delete cookies[i];
    		continue
    	}
    	var kv = cookies[i].trim().split("=");
    	cookieObj[kv[0]] = kv[1];
    }
    return cookieObj
}

module.exports = {
	cookie
};