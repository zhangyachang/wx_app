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


/**
 * 配置前后端的推送消息
 *
 */
router.get('/checkPushMsg', wx_msg.check_push);

/**
 * 接收用户发送给小程序客服的消息
 *
 */
router.post('/checkPushMsg', wx_msg.handle_customer_sevice);

/**
 *  测试post接口
 *
 */

router.post('/testPost', (req, res) => {
  console.log(req.query);
  console.log(req.body);
  res.send('hello world');
  
});


/**
 *
 *  根据前端的coke去后台去请求 openid 和 session_key
 *  @params  code
 *
 */
router.post('/code', wx_msg.code);


// 在后端服务器中调用，获取这些模板的id
router.get('/get_templateid', wx_msg.get_templateid);




module.exports = router;