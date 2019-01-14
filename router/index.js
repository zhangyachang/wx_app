const express = require('express'),
    router = express.Router();


const {appInfo} = require('../config');



router.get('/', (req, res) => {
  res.send('请求成功');
});

// 获取token
router.get('/token', (req, res) => {
  console.log('请求到了');
  res.send('请求成功');
  axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appInfo.appId}&secret=${appInfo.secret}`)
      .then(res => {
        console.log(res);
        res.send(res);
      })
      .catch(err => {
        console.log(err);
      });
});




module.exports = router;