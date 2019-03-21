const axios = require('axios');
const request = require('request');
const {app, pushToken} = require('../config/wx_config');
const {result} = require('./result');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const {join} = require('path');
const {sha1, decrypt} = require('../utils/utils');
const utils = require('../utils/utils');
const ZY = require('../module/init');
const config = require('../config/wx_config');

const upload = multer({dest: join(process.cwd(), 'public', 'down')});


/**
 *   版本 0.0.1
 *
 *
 *   返回值 示例
 *    成功
 *   {
 *     access_token: 18_vrDeYZhDhbqsGDCDvHNw'-jkrsvFF4dQKA1RYQ2dkSCDFZ
 *        QYelkXaJTQ3IWYs4fJV8Xlt9crMOCiBlOcLppISvxQq5SEJAyPeCQchZOf4eSsB7XS4eesCgtpJWsKGRL_n0HNLneSjT8ZOiWmvYMIgADAJXT',
 *     status: 75200
 *   }
 *
 *   失败
 *   {
 *     status: 75400,
 *     errmsg: '请求错误'
 *   }
 */

exports.accessToken = (req, res) => {
    if(config.access_token){
        res.send({
            access_token: config.access_token,
            status: 75200
        });
    }else{
    res.send({
            errmsg: '请求错误',
            status: 75400
        });
    }
};


/*
    验证服务器推送url地址
        开发者提交信息后，微信服务器将发送GET请求到填写的服务器URL上，GET请求携带参数如下
        @params signature 微信加密签名，signature结合了开发者填写的token参数和请求中的timestamp参数，nonce参数
        @params timestamp	时间戳
        @params nonce	随机数
        @params echostr	随机字符串
*/

exports.check_push = (req, res) => {
  console.log(req.query);
  let signature = req.query.signature,
      timestamp = req.query.timestamp,
      nonce = req.query.nonce,
      echostr = req.query.echostr;
  
  let a = sha1(pushToken, timestamp, nonce);

  if(a == signature){
    // 如果验证成功则原封不动的返回
    res.send(echostr);
  }else{
    res.send({
      status: 400,
      data: "check msg error"
    })
  }
};


/*
    消息体验证和解密
        客服接收到的消息
        handle_customer_sevice
        
*/

exports.handleCustomerServer = (req, res) => {
    console.log('接收到了消息，请求体中');
    console.log(req.body);
    console.log('接收到了消息，请求url中');
    console.log(req.query);
    let signature = req.query.signature,
        timestamp = req.query.timestamp,
        nonce = req.query.nonce,
        openid = req.query.openid,
        encrypt_type = req.query.encrypt_type,
        msg_signature = req.query.msg_signature,
        msg_encrypt = req.body.Encrypt; // 密文体
    
    // 开发者计算签名
    let devMsgSignature = sha1(pushToken, timestamp, nonce, msg_encrypt);
    
    if(devMsgSignature == msg_signature){
        console.log('验证成功,是从微信服务器转发过来的消息');
        
        let returnObj = decrypt({
            AESKey: config.server.EncodingAESKey,
            text: msg_encrypt,
            corpid: config.app.appId
        });
        console.log('解密后的消息');
        console.log(returnObj);
        console.log('解密后的消息内容');
        const decryptMessage = JSON.parse(returnObj.msg);
        console.log(decryptMessage);
     
        /*
            详细参数请查看官网 消息 https://developers.weixin.qq.com/miniprogram/dev/api/sendCustomerMessage.html
            @params
                access_token  调用接口凭证
                touser   用户的openid
                msgtype   消息类型
         */
        if(JSON.parse(returnObj.msg).Content == '值班'){
            ZY.msg.textMsg(decryptMessage.FromUserName, decryptMessage.FromUserName, '新年好!!')
                .then(res => {
                    console.log('封装消息发送成功');
                    console.log(res);
                })
                .catch(err => {
                    console.log('封装消息发送失败');
                    console.log(err);
                })
        }else if(JSON.parse(returnObj.msg).Content == '王世民'){
            ZY.msg.textMsg(decryptMessage.FromUserName, "oSHxV4_GZeesvpXw8QOHLDuTu25w", '王世民新年好啊！！')
                .then(res => {
                    console.log('封装消息发送成功');
                    console.log(res);
                })
                .catch(err => {
                    console.log('封装消息发送失败');
                    console.log(err);
                })
        }
        
        // if(decryptMessage.FromUserName == "oSHxV48mzVFD-6-Urf85cyj0bklY"){
        //     // 这个是我的消息
        //     ZY.msg.textMsg(decryptMessage.FromUserName, "oSHxV4_GZeesvpXw8QOHLDuTu25w", JSON.parse(returnObj.msg).Content)
        //         .then(res => {
        //             console.log('封装消息发送成功');
        //             console.log(res);
        //         })
        //         .catch(err => {
        //             console.log('封装消息发送失败');
        //             console.log(err);
        //         })
        // }else if(decryptMessage.FromUserName == "oSHxV4_GZeesvpXw8QOHLDuTu25w") {
        //     // 这个是王世民的消息
        //     ZY.msg.textMsg(decryptMessage.FromUserName, "oSHxV48mzVFD-6-Urf85cyj0bklY", JSON.parse(returnObj.msg).Content)
        //         .then(res => {
        //             console.log('封装消息发送成功');
        //             console.log(res);
        //         })
        //         .catch(err => {
        //             console.log('封装消息发送失败');
        //             console.log(err);
        //         })
        // }
        
        res.send('success');
        
    }else{
        console.log('error');
        res.send('error');
    }
};

/**
 * 此处方法解析的是微信消息加密 XML 格式的
 * 
 * 过程介绍为 
 * 1. 先拿到消息 URL 中的字符串，并且拿到消息体中的密文体
 * 2. 对 URL 和 密文体 进行微信方面提供的加密方法验证是否等于消息体签名，验证消息是否为微信转发过来的
 * 3. 
 * 
 * URL地址中的内容
 * 
 * @params {String} signature      签名串
 * @params {String} timestamp      时间戳
 * @params {String} nonce          随机串
 * @params {String} encrypt_type   加密类型（aes）
 * @params {String} openid         
 * @params {String} msg_signature  消息体签名.用于验证消息体的正确性
 * 
 * 请求体中的内容 -- 解析后
 * @params {String} tousername    小程序的原始id
 * @params {String} encrypt       加密后的消息字符串
 *  
 */
exports.handleCustomerServerXML = (req, res) => {
  console.log('接收到了请求url中');
  console.log(req.query);
  console.log('接收到了请求，请求体中');
  console.log(req.body);
  const {signature,timestamp, nonce, encrypt_type, openid, msg_signature} = req.query;
  const msg_encrypt = req.body.xml.encrypt[0];
  
  // 验证消息的正确性
  const dev_msg_signature = sha1(config.pushToken, timestamp, nonce, msg_encrypt);
  if(dev_msg_signature == msg_signature){
    console.log('签名消息正确,来自微信服务器');
    console.log('把消息体传入解析函数中');
    console.log({
      AESKey: config.server.EncodingAESKey,
      text: msg_encrypt,
      corpid: config.app.appId
    });

    const lastData = utils.decrypt({
      AESKey: config.server.EncodingAESKey,
      text: msg_encrypt,
      corpid: config.app.appId
    });
    console.log(lastData);
  }

  res.send('接收到了请求');
}




/**
 *  前台通过登录 code 来换取 openid
 *  @params  code
 *
 *    返回值 {status: 200, openid: ""}
 *
 *    重复发送code {status: 400, msg:'code only use one'}
 *    服务器内部错误 {mes: '服务器繁忙请稍后再试',status: 500}
 */

exports.getOpenidByCode = (req, res) => {
  console.log(req.body);
  if(req.body.code){
    // 这里去发送code去微信服务器去验证 返回来 session_key + openid
    axios.get('https://api.weixin.qq.com/sns/jscode2session',{
      params: {
        appid: app.appId,
        secret: app.secret,
        js_code: req.body.code,
        grant_type: 'authorization_code'
      }
    })
        .then(msg => {
          console.log('换取信息成功');
          console.log(msg.data);
          // 这里就可以获得到 openid 和 session_key
          //会话密钥 session_key 是对用户数据进行 加密签名 的密钥。为了应用自身的数据安全，开发者服务器不应该把会话密钥下发到小程序，也不应该对外提供这个密钥。
          // 临时登录凭证 code 只能使用一次
          if(msg.data.errcode){
            if(msg.data.errcode == 40163){
              res.send({status: 401,msg: 'code been used'});
            }else if(msg.data.errcode == 40029){
              res.send({status: 402, msg: 'code 无效'})
            }
          }else{
            res.send({
              status: 200,
              openid: msg.data.openid
            });
          }
          
        })
        .catch(err => {
          console.log('错误信息');
          console.log(err);
          res.send({
            mes: '服务器繁忙请稍后再试',
            status: 500
          })
        });
    
  }else{
    res.send({
      msg: '发送参数错误',
      status: 400
    })
  }
};

/*
    上传文件保存到服务器
    
    @return {Object}
        obj.status  状态码
        obj.filePath 图片在服务器中的路径
        obj.msg     提示信息
 */

exports.uploadFile = (req, res) => {
    res.send('1111');
    
};




/*
    upload
        服务器推送图片消息给用户
    @params {String} imgPath 要发送的图片的路径
 */

exports.uploadImage = (req, res) => {
    console.log('上传的数据为');
    console.log(req.query);
    console.log('上传的请求体');
    console.log(req.body);
    
    // 图片的路径还需要修改一下
    //let imgPath = join(process.cwd(), 'public', 'img', 'tab_my_select.png'),
    let imgStream = fs.createReadStream(req.query.imgPath);
    
    request.post({
        url: `${config.url.ip}${config.url.P_uploadFile}?access_token=${config.access_token}&type=image`,
        formData: {
            buffer: {
                value: imgStream,
                options: {
                    filename: '1.png',
                    contentType: 'image/png'
                }
            }
        }
    }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        console.log('Upload successful!  Server responded with:', body);
        console.log(JSON.parse(body));
        
        // 给我发送图片消息
        console.log('发送图片消息');
        ZY.msg.imgMsg("oSHxV48mzVFD-6-Urf85cyj0bklY", "oSHxV48mzVFD-6-Urf85cyj0bklY", JSON.parse(body).media_id);
        console.log('发送图片消息成功');
        
    });
    res.send('上传图片接口');
};




// 获取templateid
exports.get_templateid = (req, res) => {
  // console.log('触发了获取模板字符串的接口');
  // let access_token = config.access_token;
  let access_token = `17_TtWVacFLv5yZI_DKGOCldPcFc2awjxMExOfKPzl9FzgN2Zn9ftoRvPZOYfPWxfVQJ-N18kR7dV5Y49tHX4T3wUaP_7Ls0vqtcDD77KsLLTZzbXSVWa36_iksDHCb3gHpIFzOes8p8tUBHZX3YKNjAEAOAD`
  
  // console.log(access_token);
  // console.log(Boolean(access_token));
  
  if(access_token){
    axios.post(`https://api.weixin.qq.com/cgi-bin/wxopen/template/library/list?access_token=${access_token}`, {
        offset: 0,
        count: 20
      }
    )
        .then(msg => {
          console.log('获取模板消息id成功');
          console.log(msg);
          res.send({
            status: 200,
            msg
          })
        })
        .catch(err => {
          console.log(err);
          console.log('获取模板消息失败');
          res.send({
            status: 400,
            err
          })
        })
  }else{
    res.send('请先触发access_token')
  }
};

/**
 * 下载文件
 * 
 */

exports.downFile = (req, res) => {
    console.log('出发了这个函数把');
    // res.header("Content-Type", "application/file");
    res.sendFile(join(process.cwd(), 'public', 'omd_services.sql'), 'utf8');
    
};

/**
 * 删除文件 测试接口
 * 
 */
exports.deleteFile = (req, res) => {
    console.log('出发了删除文件的函数');
    let delFilePath = join(process.cwd(), 'public', 'img', 'wx_img');
    console.log(delFilePath);
    utils.deleteFile(join(delFilePath, 'tab_my2.png'))
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        });
    res.send("Hello world");
};