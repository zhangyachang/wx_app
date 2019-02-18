
const axios = require('axios'),
  {appInfo, pushToken} = require('../config/wx_config'),
  fs = require('fs'),
  {join} = require('path'),
  config = require('../config/wx_config');



/**
 *  获取 token
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
 *     msg: '请求错误'
 *   }
 *
 */



exports.token = (req, res) => {
  let access_token = config.access_token;
  if(access_token){
    res.send({
      access_token: access_token,
      status: 75200
    });
  }else{
    axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appInfo.appId}&secret=${appInfo.secret}`)
        .then(msg => {
          console.log('获取到的access_token的消息的格式为');
          console.log(msg.data);
          console.log(JSON.stringify(msg.data))
          
          config.access_token = msg.data.access_token;
          res.send({
            access_token: config.access_token,
            status: 75200
          });
        })
        .catch(err => {
          console.log(err);
          res.send({
            status: 75400,
            msg: '请求错误'
          })
        });
  }
};

// 验证服务器推送url地址
exports.check_push = (req, res) => {
  
  console.log(req.query);
  let signature = req.query.signature,
      timestamp = req.query.timestamp,
      nonce = req.query.nonce;
  
};




// 前台发送登录 code  这里去发送code去微信服务器去验证 返回来 session_key + openid
exports.login_code = (req, res) => {
  console.log(req.body);
  console.log(req.body.code);
  if(req.body.code){
    // 这里去发送code去微信服务器去验证 返回来 session_key + openid
    axios.get('https://api.weixin.qq.com/sns/jscode2session',{
      params: {
        appid: appInfo.appId,
        secret: appInfo.secret,
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
          res.send({
            status: 200,
            openid: msg.data.openid
          });
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

/**
 *  读取文件中的token，如果过期了就重新刷新它
 *   @params 无
 *
 */

exports.read_token = (req, res) => {


  console.log('你发送过来了');
  console.log(join(__dirname, '../', 'config', 'access_token'));
  fs.readFile(join(__dirname, '../', 'config', 'access_token'), 'utf8', (err, data) => {
    console.log('读取了文件信息吗');
    if(err) throw err;
    console.log(data);
    console.log(JSON.parse(data));
    console.log(data.access_token);


    res.send('Hi');
  })
};
