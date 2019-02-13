const express = require('express'),
    
    // 这些都是测试代码 等会都删除 *******************/
    config = require('../config/wx_config'),
    crypto = require('crypto'),
    {decrypt} = require('../utils/utils'),
    /****************/
    
    
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

/******************************/
router.post('/testPost', (req, res) => {
    console.log(req.query);
    console.log(req.body);
    let enstr1 = `HS6lVJa0HG4B5FLY7aUNLpd7N+qgXsm/hSi074/7551WEZ+3cQT5vLFXA9aJ5Os65Y2Qyz3MW+Let1f5RaO/lRHQ3LDT2j7kkB3ZNlPAwUnwoaCW1QeSKw6ObK17mNjyKP5y8G0giDkCks9JI7F3cR13KxZ4bhz2sdUBl6CI17gJJN9HXCHMv3m6Y7DTdC5/bC3cNqMW9RAVyIpPgnwpj2sLeJgjt2N+5Dd4AtZpmjWJBEv+sROWuypSDLdev3LU5FaMo5VVuHrMgs6elxhgebs74PPzjGRtlfmLT2yN0+g=`;
    // let aesKey = Buffer.from(config.server.EncodingAESKey + '=', 'base64');
    
    console.log('传递的参数为------');
    console.log({
        AESKey: config.server.EncodingAESKey,
        // text: req.body.Encrypt,
        text: enstr1,
        corpid: config.app.appId
    });
    
    let returnObj = decrypt({
        AESKey: config.server.EncodingAESKey,
        // text: req.body.Encrypt,
        text: enstr1,
        corpid: config.app.appId
    });
    console.log('返回数据为');
    console.log(returnObj);
    //let a = new Buffer(enstr1, 'base64').toString();
    // let a = new Buffer(enstr1, 'base64').toString();
    res.send('hello world');
});

/******************************/

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