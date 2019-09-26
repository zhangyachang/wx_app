/*
*   参数：
*       type ： string类型   请求的方式     默认get
*       url ： string类型    接口           必填
*       aysn： boolean类型   是否异步       默认异步
*       data： json          发送的数据     可选
*       success:  function   成功回调函数     可选
*       error：   function   失败回调函数    可选
* */
ajax({
    type:"post",
    url:"1.php",
    aysn:true,
    data:{
        user : "dCup",
        age:20
    },
    success:function (msg) {
        console.log(msg)
    },
    error:function (msg) {
        console.log("错误代码："+msg)
    }
});

function ajax(obj) {
    var type = obj.type||"GET",
        url = obj.url,
        aysn = obj.aysn!==false,
        data = obj.data,
        success = obj.success,
        error = obj.error;
    //确实是否有数据，有就处理，没有则过
    if(data){
        data = (function () {
            var str = "";
            for (var key in data){
                str += key + "=" + data[key] + "&"
            }
            return str;
        })()
    }
    //解决缓存问题   // "get"
    if(/get/i.test(type)){
        url+= "?"+ (data||"") + "t_="+ Date.now(); // ?t_=12315646597
    }
    
    var xhr = new XMLHttpRequest();
    xhr.open(type,url,aysn)
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.send(data||null)
    xhr.onreadystatechange=function () {
        if(xhr.readyState===4){
            if(xhr.status>=200&&xhr.status<300||xhr.status===304){
                success && success(xhr.responseText)
            }else{
                error && error(xhr.status)
            }
        }
    }
}