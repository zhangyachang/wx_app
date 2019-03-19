const crypto = require('crypto'),
    fs = require('fs'),
    {result} = require('../module/result');

/*
    @explain sh1加密
    @version 1.0.1
    
    @author : Z
    @data : 2019-2-13
    
    @params {String, String...} a,b,c……
    @return {String} 加密完成后的字符串
 */
exports.sha1 = function (...arr) {
    return crypto.createHash('sha1').update(arr.sort().join('')).digest('hex');
};

/*
    @explain: 微信的消息密文解密方法
    @version 1.0.1
        修复部分消息解析失败的情况
    @author: Z
    @data :2019-02-14
    @params {Object}
        obj.AESKey:解密的aesKey值
        obj.text: 需要解密的密文
        obj.corpid: 企业的id / 微信小程序的appid
  
    @return {Object}
        obj.noncestr  随机数
        obj.msg_len   微信密文的len
        obj.msg       解密后的明文
*/

exports.decrypt = function (obj) {
    let aesKey = Buffer.from(obj.AESKey + '=', 'base64');
    const cipherEncoding = 'base64';
    const clearEncoding = 'utf8';
    const cipher = crypto.createDecipheriv('aes-256-cbc',aesKey,aesKey.slice(0, 16));
    cipher.setAutoPadding(false); // 是否取消自动填充 不取消
    let this_text = cipher.update(obj.text, cipherEncoding, clearEncoding) + cipher.final(clearEncoding);
    /*
        密文的构成
            Base64_Encode(AES_Encrypt[random(16B) + msg_len(4B) + msg + $appId])
        但是由于部分消息是不满足那个 32 位的，所以导致上面那个 cipher.final() 函数报错，所以修改为了自动填充，所以 appId后面还跟着一些字符
            就无法正常解析了，所以就不返回 corpid 了，然后返回我们想要的东西。
     */
    return {
        noncestr:this_text.substring(0,16),
        msg_len:this_text.substring(16,20),
        msg:this_text.substring(20,this_text.lastIndexOf("}")+1)
    }
};

/*
    @explain    上传文件
    @version    1.0.0
    @author     Z
    @data       2019-2-15
    @params {String} urlPath 文件路径
    @params {String} type 文件类型
 */

exports.uploadFile = function (urlPath, type) {
    return new Promise((resolve, reject) => {
    
    })
};


/*
    @explain 删除文件
    @version 1.0.0
    @author Z
    @data   2019-2-15
    @params String 要删除的文件路径
    
    @return {Object}
        {
            status:;
            msg: ""
        }
 */
exports.deleteFile = function (localPath) {
    return new Promise((resolve, reject) => {
        try {
            fs.unlink(localPath, (err, data) => {
                if(err){
                    reject(result(400,{msg:'删除失败', err: err}, 'notcode'))
                }else{
                    resolve(result(200, '删除文件成功'));
                }
            })
        }catch (e) {
            console.log('执行到catch了吧');
            reject(e);
        }
    });
};









