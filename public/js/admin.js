(function(){
	require("bootstrap/dist/css/bootstrap.min.css");
    require("../css/admin.css");
    const ajax = require("./ajax.js");
    const com = require("./com.js");
    var getClass = com.getClass;
    if(getClass("articleSub")[0]){
        subG("articleSub","add")
    }
    if(getClass("updateSub")[0]){
        subG("updateSub","update")
    }
    if(getClass("linkSub")[0]){
        getClass("linkSub")[0].onclick = function(){
            var v = getClass("form-control");
            var linkName = v[0].value;
            var linkUrl = v[1].value;
            var linkDescribe = v[2].value;
            !v[0].value 
            ? alert("链接名称呢？") 
            : !v[1].value 
            ? alert("链接地址呢？") 
            : !v[2].value
            ? alert("链接描述呢？！") 
            : ajax({
                url:"/ajax/link/add",
                method:"POST",
                async:true,
                dataType:"text",
                data:{
                    name:linkName,
                    url:linkUrl,
                    description:linkDescribe
                },
                callback:function(data,err){
                    err ? alert("请求失败") : JSON.parse(data).code == 200 ? alert("添加成功") : alert("添加成功");
                }
            })          
        }
    }

    var categoryAddSub;
    if(categoryAddSub = com.getClass("category_add_sub")[0]){
        categoryAddSub.onclick = function(){
            var v = com.getClass("add_category_input")[0].getElementsByTagName("input");
            !v[0].value ? alert("分类名称？") : !v[1].value ? alert("分类别名？") :
            ajax({
                url:"/ajax/category/add",
                method:"POST",
                data:{
                    name:v[0].value,
                    byname:v[1].value
                },
                callback:function(data,err){
                    data = JSON.parse(data);
                    err || data.code == 500 ? alert("ajax error") : alert("添加成功");
                }
            })
        }
    }

    var pagination;
    if(pagination = getClass("pagination")[0]){
        var li = pagination.getElementsByTagName("li");
        var liLens = li.length - 2;
        var active = getClass("active")[0],activeNum;
        active ? activeNum = Number(active.innerText) : activeNum = 1
        if(liLens == 0 || liLens == 1){
            return
        }
        liLens === activeNum
        ?  li[0].getElementsByTagName("a")[0].setAttribute("href",`${document.location.pathname}?page=${activeNum - 1}&limit=10`)
        :  activeNum === 1
        ?  li[li.length-1].getElementsByTagName("a")[0].setAttribute("href",`${document.location.pathname}?page=${activeNum + 1}&limit=10`)
        :  (li[0].getElementsByTagName("a")[0].setAttribute("href",`${document.location.pathname}?page=${activeNum - 1}&limit=10`),li[li.length-1].getElementsByTagName("a")[0].setAttribute("href",`/admin/article/all?page=${activeNum + 1}&limit=10`));
    }
    let loginSub;
    if(loginSub = getClass("loginSub")[0]){
        loginSub.onclick = function(){
            var input = document.getElementsByTagName("input");
            var userName = input[0].value;
            var password = input[1].value;
            ! userName 
            ? alert("傻瓜，用户名都没有输入，点什么点")
            : !password
            ? alert("是不是二货，不要密码？")
            : 
            ajax({
                url:"/ajax/admin/login",
                method:"POST",
                async:true,
                dataType:"text",
                data:{
                    username:userName,
                    password:password
                },
                callback:function(data,err){
                    data = JSON.parse(data);
                    if(err){
                        alert("请求失败");
                        return
                    }
                    if(data.code == 404 || data.code == 501){
                        alert("用户名或密码输错啦！");
                        return
                    }else{
                        window.location = data["url"];
                    }
                }
            })
        }
    }

    function subG(el,type){
        var v = getClass("form-control");
        var form = document.getElementById("form");
        getClass(el)[0].onclick = function(){
            var formData = new FormData(form); 
            formData.delete("content");
            formData.append("content",editor.getHtml());
            if(type == "update"){
                var id = getClass("content_right")[0].getAttribute("data-id");
                var cid = getClass("content_right")[0].getAttribute("data-cid");
                id && formData.append("id",id);
                cid && formData.append("cid",cid);   
            }  
            v[1].value == "" &&  formData.delete("file");       
            
            !v[0].value 
            ? alert("标题没写，傻吊！") 
            : !v[2].value 
            ? alert("文章分类呢！") 
            : !v[3].value 
            ? alert("标签没写，傻叉！") 
            : !v[4].value
            ? alert("描述没写，傻猪！") 
            : !v[5].value
            ? alert("文章不要内容吗？大哥！") 
            : ajax({
                url:"/ajax/article/"+type,
                method:"POST",
                async:true,
                dataType:"text",
                contentType:false,
                processData:false,
                data:formData,
                callback:function(data,err){
                    err ? alert("请求失败") : JSON.parse(data).code == 200 ? alert("成功") : alert("成功");
                }
            })          
        }
    }

    //编辑器
    var ele_textarea = document.getElementById('md_editor');
    var editor = new mditor(ele_textarea,{
        previewClass : 'article_cont'
    });

})()
