/*
    微信加密消息开发
        下面几个方面的内容
            1. 加密前明文结构
            2. 16字节的随机字符串
            3. 消息长度的网络子序列
            4. 加密方式
            5. 加密算法
            6. 填充块计算方式
            7. 加密实现
    
 */

/*
    1. 加密前的明文结构 Random(16B) + msg_len(4B) + msg + $appId
        说明： Random(16B)为16字节的随机字符串； msg_len为msg的长度，占4个字节(网络子序列)，$appId为公众号/小程序id
 */


/*
    2. 16位字节随机字符串；没啥说的直接拼接就好了
    
        @explain 生成 x 位字节随机字符串
        @params
            传入要生成的随机的字符串的位数
        
        @return
            返回生成的字符串
 */
const randomPrefix = function (n) {
    let _str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let buf = new Buffer(n);
    for (let i = 0; i < n; i++) {
        buf[i] = _str.charCodeAt(Math.floor(Math.random() * _str.length));
    }
    return buf;
};




/*
    3. 网络子节序：网络子节序根据消息主体长度而生成
*/

const htonl = function(n) {
    let buf = new Buffer(4);
    buf[0] = (n & 0xFF000000) >> 24;
    buf[1] = (n & 0x00FF0000) >> 16;
    buf[2] = (n & 0x0000FF00) >> 8;
    buf[3] = (n & 0x000000FF) >> 0;
    return buf;
};

/*
    4. 加密方式 Base64_Encode(AES_Encrypt[random(16B) + msg_len(4B) + msg + $appId])
 */

/*
    5. 加密算法
        AES采用CBC模式，秘钥长度为32个字节，数据采用PKCS#7填充； K为秘钥字节数(采用32)，buf为待加密的内容，N为其字节数。Buf需要被填充为K的整数倍。
            在buf的尾部填充(k-N%K)个字节，每个字节的内容是(K-N%K);
 */
/*
    6. 填充块计算方式：消息体长度/32

 */
const padding = function (n){
    let len = n % 32;
    if(len == 0){
        len = 32;
    }else{
        len = 32 - len;
    }
    let buf = new Buffer(len);
    for(let i=0;i<len;i++){
        buf[i] = len;
    }
    return buf;
};

/*
    7. 加密实现
        1. 加密采用crypto库
        2. 加密方式 aes-256-cbc
        3. key
 */



/*
    @explain 微信消息的加密方法
    @version 1.0.0
    @data 2019-2-13
    @params {Object}
        obj.msg             待加密消息
        obj.corpId          企业id/小程序id
        obj.encodingAESKey  加密签名
        
    @return
    
*/
exports.encrypt = function (msg) {
    
    let msgBuf = new Buffer(msg, "utf-8"),
        msgBufLength = msgBuf.length,
        preBuf = randomPrefix(16),
        netBuf = htonl(msgBufLength),
        corpBuf = new Buffer(corpId, "utf-8"),
        corpBufLength = corpBuf.length,
        paddingBuf = padding(20 + msgBufLength + corpBufLength);
    let cipher = crypto.createCipheriv('aes-256-cbc', encodingAESKey, encodingAESKey.slice(0, 16));
    cipher.setAutoPadding(false); // 取消自动填充
    return cipher.update(Buffer.concat([preBuf, netBuf, msgBuf, corpBuf, paddingBuf]), "binary", 'base64') + cipher.final('base64'); // 解密数据
    
};