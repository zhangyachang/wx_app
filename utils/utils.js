const crypto = require('crypto');

/*
    @explain sh1加密
    @version 1.0.1
    
        1.0.0版本传递过来的是排序过的字符串
        1.0.1版本升级，只需要把要排序的字符串传递过来就可以
        
    @author : Z
    @data : 2019-2-13
    
    @params : a,b,c……
    @return : String 加密完成后的字符串
 */
exports.sha1 = function (...arr) {
    return crypto.createHash('sha1').update(arr.sort().join('')).digest('hex');
};

/*
    @explain: 微信的消息密文解密方法
    @version 1.0.0
    @author: Z
    @data :2019-02-13
    @params:
        obj.AESKey:解密的aesKey值
        obj.text: 需要解密的密文
        obj.corpid: 企业的id
  
    @return
        obj.noncestr  随机数
        obj.msg_len   微信密文的len
        obj.msg       解密后的明文
        obj.corpid    企业id
*/

exports.decrypt = function (obj, type) {
    try{
        let aesKey = Buffer.from(obj.AESKey + '=', 'base64');
        const cipherEncoding = 'base64';
        const clearEncoding = 'utf8';
        console.log('第一步');
        console.log('aesKey===》',aesKey);
        const cipher = crypto.createDecipheriv('aes-256-cbc',aesKey,aesKey.slice(0, 16));
        
        
        // if(type == 'msg'){
            cipher.setAutoPadding(false);
        // }
        console.log('第二步');
        let this_text = cipher.update(obj.text, cipherEncoding, clearEncoding) + cipher.final(clearEncoding);
        console.log('第三部');
        console.log(this_text);
        
        console.log('第四部');
        return {
            noncestr:this_text.substring(0,16),
            msg_len:this_text.substring(16,20),
            msg:this_text.substring(20,this_text.length-obj.corpid.length),
            corpid:this_text.substring(this_text.length-obj.corpid.length,this_text.length)
        }
    }catch (e) {
        console.log('捕获到的错误信息');
        console.log(e);
    }
    
};








