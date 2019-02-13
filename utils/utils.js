
const crypto = require('crypto');
// sha1加密

exports.sha1 = function (str) {
  return crypto.createHash('sha1').update(str).digest('hex');
};

/*
    @explain: 微信的消息密文解密方法
    
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
    let aesKey = Buffer.from(obj.AESKey + '=', 'base64');
    const cipherEncoding = 'base64';
    const clearEncoding = 'utf8';
    const cipher = crypto.createDecipheriv('aes-256-cbc',aesKey,aesKey.slice(0, 16));
    
    if(type == 'msg'){
        cipher.setAutoPadding(false)
    }
    let this_text = cipher.update(obj.text, cipherEncoding, clearEncoding) + cipher.final(clearEncoding);
    return {
        noncestr:this_text.substring(0,16),
        msg_len:this_text.substring(16,20),
        msg:this_text.substring(20,this_text.length-obj.corpid.length),
        corpid:this_text.substring(this_text.length-obj.corpid.length,this_text.length)
    }
};


