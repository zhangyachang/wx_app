const express = require('express'),
    router = express.Router();

const wx_msg = require('../module/wx_msg');



router.get('/', (req, res) => {
  res.send('server is success run');
});

/**
 *  获取 access_token
 *   @params  无
 */

router.get('/accessToken', wx_msg.accessToken);

// 配置前后端的推送消息
router.get('/msg', wx_msg.check_push);

/**
 *
 *  根据前端的coke去后台去请求 openid 和 session_key
 *  @params  code
 *
 */
router.post('/login_code', wx_msg.login_code);


// 在后端服务器中调用，获取这些模板的id
router.get('/get_templateid', wx_msg.get_templateid);




module.exports = router;