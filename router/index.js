const express = require('express'),
    router = express.Router();



router.get('/', (req, res) => {
  res.send('请求成功');
});

// 获取token
router.get('/token', (req, res) => {
  console.log('请求到了');
  res.send('请求成功');
});




module.exports = router;