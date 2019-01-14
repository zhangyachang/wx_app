const express = require('express'),
   
    router = express.Router();

const logic = require('../logic/logic');




router.get('/', (req, res) => {
  res.send('请求成功');
});

// 获取token
router.get('/token', logic.token);


// 获取登录的code
router.post('/login_code', logic.login_code);





module.exports = router;