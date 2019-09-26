const express = require('express');
const upload = require('../utils/multer');
const router = express.Router();


const wx_msg = require('../module/wx_msg');


router.get('/', (req, res) => {
  res.send('server is success run');
});

/**
 * 获取 access_token
 * 
 */
router.get('/accessToken', wx_msg.accessToken);


/**
 * 配置前后端的推送消息
 * 
 */
router.get('/checkPushMsg', wx_msg.check_push);

/**
 * 接收用户发送给小程序客服的消息
 * 此方法解析的是 json 格式加密的
 * 
 */
// router.post('/checkPushMsg', wx_msg.handleCustomerServer);

/**
 * 接收用于发送给小程序客服的消息
 * 此方法解析的是 xml 格式加密的
 * 
 */
router.post('/checkPushMsg', wx_msg.handleCustomerServerXML);



/**
 * 上传文件
 * 
 */
router.post('/uploadFile', upload.single('file'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log('打印文件信息');
    console.log(req.file);
    res.send({
        status: 200,
        file: req.file
    });
});

/**
 * 测试 base64 转码
 * 
 * 
 */





// 上传图片地址 把媒体文件上传到微信服务器。目前仅支持图片。用于发送客服消息或被动回复用户消息。
router.get('/upload', wx_msg.uploadImage);



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
    res.send('1111');
    
});
router.get('/deleteFile', wx_msg.deleteFile);
router.get('/down', wx_msg.downFile);
/****************************/


/**
 * 在后端服务器中调用，获取这些模板的id
 */
router.get('/get_templateid', wx_msg.get_templateid);


router.post('/textxml', (req, res) => {
    console.log('请求到了接口');
    var data = '';
    console.log(req);
    
    req.on('data', (chunk) => {
        data += chunk;
    });
    req.on('end', () => {
        console.log('接收完毕');
        console.log(data);
    });

    res.send('xml');
});




module.exports = router;