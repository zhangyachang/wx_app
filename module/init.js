/* 初始化微信的access_token */
const config = require('../config/wx_config'),
    axios = require('axios');

module.exports = {
    // 程序初始化
    init() {
        this.getAccessToken();
        this.auto_refreshAccessToken();
    },
    
    // 自动刷新 去获取token
    auto_refreshAccessToken(){
        // 每隔7000s去刷新一次 access_token
        setInterval(() => {
        console.log('access_token刷新函数执行了');
        this.getAccessToken();
        }, 7000000);
    },
    
    // 获取 access_token
    getAccessToken(){
        axios.get(`${config.url.ip}${config.url.getAccessTokenUrl}&appid=${config.app.appId}&secret=${config.app.secret}`)
            .then(res => {
                // console.log(res.data);
                config.access_token = res.data.access_token;
                console.log('access_token初始化成功');
            })
            .catch(err => {
                console.log('获取access_token失败，请检查程序逻辑');
                console.log(err);
            });
    },
    
    // 发送客服消息封装一个函数
    /*
        @explain 发送客服消息给用户
        @params msgtype  消息类型
            文本消息 text  图片消息 image  图文链接 link 小程序卡片 miniprogrampage
        @params con 消息内容
        
        @return
        
     */
    pushMessage(msgtype, con){
    
    },
    
};
