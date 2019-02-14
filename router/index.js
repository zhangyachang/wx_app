const express = require('express'),
    router = express.Router();

/****************************/
const {encrypt} = require('../utils/encrypt');



/****************************/

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
 *  XXXXXXXXXXXXXXXXX
 *  这个接口不应该改为 get 请求吗？？ 当时是怎么想的，等闲下来的时候修改一下
 *  XXXXXXXXXXXXXXXXXXX
 *
 *  根据前端的coke去后台去请求 openid 和 session_key
 *  @params  code
 */
router.post('/code', wx_msg.getOpenidByCode);


/****************************/
router.get('/testAPI', (req, res) => {
    console.log('请求到了testAPI接口');
    encrypt();
    res.send('1111');
    
});
router.get('/down', wx_msg.downFile);
/****************************/


// 在后端服务器中调用，获取这些模板的id
router.get('/get_templateid', wx_msg.get_templateid);




module.exports = router;