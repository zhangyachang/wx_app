
const axios = require('axios'),
  {appInfo, access_token} = require('../config'),
    config = require('../config');



// 获取 token
exports.token = (req, res) => {
  if(access_token){
    res.send(access_token);
  }else{
    axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appInfo.appId}&secret=${appInfo.secret}`)
        .then(msg => {
          config.access_token = msg.data.access_token;
          res.send(config.access_token);
        })
        .catch(err => {
          console.log(err);
          res.send({
            status: 400,
            msg: '请求错误'
          })
        });
  }
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
            msg: msg.data.openid
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
