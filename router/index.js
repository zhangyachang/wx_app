const express = require('express'),
    axios = require('axios'),
    router = express.Router();


const {appInfo, access_token} = require('../config');
const config = require('../config');


router.get('/', (req, res) => {
  res.send('请求成功');
});

// 获取token
router.get('/token', (req, res) => {
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
  
});




module.exports = router;