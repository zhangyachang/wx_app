const express = require('express'),
    router = express.Router();



router.get('/', (req, res) => {
  res.send('请求成功');
});



module.exports = router;