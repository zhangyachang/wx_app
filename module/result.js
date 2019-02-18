exports.result = function (code,text,type) {
    switch (code) {
        case 200:
            !text?text="成功":false;
            break;
        case 400:
            !text?text="失败":false;
            break;
        case 500:
            !text?text="服务器异常":false;
            break;
    }
    if(type == "notcode"){
        if(typeof text == "object"){
            text.result = code;
        }
        return text;
    }else{
        return {result:code,msg:text};
    }
    
};