const axios = require('axios'),
  {app, pushToken} = require('../config/wx_config'),
  fs = require('fs'),
  crypto = require('crypto'),
  {join} = require('path'),
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
 *
 *
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
      nonce = req.query.nonce;
  console.log('推送消息为');
  console.log(pushToken);
  console.log('传递的参数为');
  console.log(signature, timestamp, nonce);
  console.log('进行字典排序后');
  console.log([pushToken, timestamp, nonce].sort().join(''));
  let a = crypto.createHash('sha1').update([pushToken, timestamp, nonce].sort().join('')).digest('hex');
  console.log('加密后的东西');
  console.log(a);
  console.log('微信传递过来的加密签名');
  console.log(signature);
  if(a == signature){
    res.send({
      status: 200,
      data: 'check push msg success'
    })
  }else{
    res.send({
      status: 400,
      data: "check msg error"
    })
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
 *
 *
 */
exports.code = (req, res) => {
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
