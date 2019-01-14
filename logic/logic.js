
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
          res.send(msg.data);
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
