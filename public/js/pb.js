    import com from "./com.js";

    //瀑布流
    function pb(){
        var articleCont = com.getClass("articleCont");      
        var arr = [];
        var lastarr = [];
        if(articleCont.length == 0){
            return
        }
        for (var i = 0; i < articleCont.length; i++) {
            if(i < domNum()){   
                articleCont[i].style.position = "absolute";
                articleCont[i].style.top = "0px";
                if(i == 0){
                    articleCont[i].style.left = "0px";
                }else{
                    articleCont[i].style.left = (cWidth(0) + 10)*i + "px";
                }
                arr.push(articleCont[i].offsetHeight);
            }else{
                var minHeight = min(arr); 
                var minNumIndex = arr.indexOf(minHeight);
                var top = minHeight + 10 ;
                var left = articleCont[minNumIndex].offsetLeft;
                articleCont[i].style.position = "absolute";
                articleCont[i].style.top = top  + "px";
                articleCont[i].style.left = left + "px";
                arr[minNumIndex] += articleCont[i].offsetHeight + 10;
            } 
            //获取最后一排的（高度 + 基于父元素的 top 距离）放在数组 domNum() 是获取一排可以放几个 例如：放三个 length 是 30 30-3=27 当i 执行到27
            //就会获取第 27 个节点 的高度 一直获取到 第29 个
            if(i >= articleCont.length-domNum()){
                lastarr.push(articleCont[i].offsetHeight + articleCont[i].offsetTop);
            }       
        }
        var last_maxheight = max(lastarr);//将数组 颠倒顺序 获取最大值
        var maxheightIndex = lastarr.reverse().indexOf(last_maxheight);
        //获取最大值在数组中的位置 这里将数组颠倒顺序 是为了 后面 方便获取第几个节点
        var last_max_Top = articleCont[articleCont.length-(maxheightIndex+1)].offsetTop;
        var last_max_H = articleCont[articleCont.length-(maxheightIndex+1)].offsetHeight;
        com.getClass("blogArticle")[0].style.height = last_max_Top+last_max_H +  "px";  

    }


    function pWidth(num){
        var blogArticle = com.getClass("blogArticle")[num];
        return blogArticle.offsetWidth;
    }

    function cWidth(num){
        var articleCont = com.getClass("articleCont")[num];
        return articleCont.offsetWidth;
    }

    function domNum(){
        return parseInt(pWidth(0)/cWidth(0))

    }

    function min(arr){ //Math.max.apply(null,arr) Math.min.apply(null,arr) 也可以取最大最小  这里用下遍历练习
        var minNum = Infinity;
        for (var i = 0; i < arr.length; i++) {
            arr[i]<minNum ? minNum = arr[i] : null;
        }
        return minNum
    }

    function max(arr){
        var maxNum = -Infinity;
        for (var i = 0; i < arr.length; i++) {
            arr[i]>maxNum ? maxNum = arr[i] : null;
        }
        return maxNum
    }

    function setStyle(obj){
        var el = com.getClass(obj.el)[0];
        var k = Object.keys(obj.style);

        for (var i = 0; i < k.length; i++) {
            el.style[k[i]] = obj.style[k[i]];
            // console.log(k[i] +"============"+obj.style[k[i]])
        }
    }

    module.exports = pb;