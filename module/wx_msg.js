const axios = require('axios'),
  {app, pushToken} = require('../config/wx_config'),
  fs = require('fs'),
  crypto = require('crypto'),
  {join} = require('path'),
  {sha1, decrypt} = require('../utils/utils'),
  config = require('../config/wx_config');


/**
 *   版本 0.0.1
 *
 *
 *   返回值 示例
 *    成功
 *   {
 *     access_token: '18_vrDeYZhDhbqsGDCDvHNw-jkrsvFF4dQKA1RYQ2dkSCDFZ
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

exports.handle_customer_sevice = (req, res) => {
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
            axios.post(config.url.ip + config.url.P_CustomSend + '?access_token='+config.access_token, {
                    touser: decryptMessage.FromUserName,
                    msgtype: "text",
                    text: {
                        content: "发送消息"
                    }
                })
                .then(res => {
                    console.log('消息接口发送成功');
                    
                    console.log(res.data);
                    if(res.data.errcode == 0){
                        console.log('消息发送成功');
                    }else if(res.data.errcode == 40001){
                        console.log('access_token过期');
                    }else{
                        console.log('其他错误信息')
                    }
                    console.log(res.data);
                })
                .catch(err => {
                    console.log('错误消息');
                    console.log(err);
                })
        }
        res.send('success');
    }else{
        console.log('error');
        res.send('error');
    }
};



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
    upload

 */

exports.upload = (req, res) => {
    console.log('上传的数据为');
    console.log(req.query);
    console.log('上传的请求体');
    console.log(req.body);
    
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



/*
    下载文件
 */

exports.downFile = (req, res) => {
    console.log('出发了这个函数把');
    // res.header("Content-Type", "application/file");
    res.sendFile(join(process.cwd(), 'public', 'omd_services.sql'), 'utf8');
    
};