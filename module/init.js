/* 初始化微信的access_token */
const config = require('../config/wx_config'),
    {result} = require('./result'),
    axios = require('axios');

/*
    @explain init NodeJs标准方法库
    @author Z
    @data 2019-1-16
    @version 1.0.0
 */

module.exports = {
    // 程序初始化
    init() {
        this.getAccessToken();
        this.auto_refreshAccessToken();
    },
    
    route: {
        /*
            @explain 解决post与get请求获取不统一的问题
            @author Z
            @data   2019-2-15
            @params
                req:route(路由)方法的req参数
                res:route(路由)方法的res参数
            @return
                obj.client : 返回给客户端的json对象，所有返回客户端的结构必须基于此对象
                obj.params : 用户提交的参数对象集合
        */
        init: function (req, res) {
            let obj = {
                client: {}
            };
            obj.params = req.method=="POST"?req.body:req.query;
            return obj;
        }
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
    msg: {
        /*
            @explain    发送文本消息
            @data       2019-2-15
            @version    1.0.0
            @author     Z
            @params
                obj.fromUser  谁发送的
                obj.toUser    发送给谁的
                obj.con       消息内容
            
            @return
            
         */
        textMsg(fromUser, toUser, con) {
            console.log('init 中消息推送');
            
            return new Promise((resolve, reject) => {
                try{
                    axios.post(config.url.ip + config.url.P_CustomSend + '?access_token='+config.access_token,{
                            touser: toUser,
                            msgtype: "text",
                            text: {
                                content: con
                            }
                        })
                        .then(res => {
                            console.log(res.data);
                            let text = {};
                            if(res.data.errcode == 0){
                                console.log('消息发送成功');
                                text = result(200, '消息接口发送成功');
                                
                            }else if(res.data.errcode == 40001){
                                text = result(400, "access_token过期");
                            }else{
                                text = result(401, res.data, 'notcode');
                            }
                            resolve(text);
                        })
                        .catch(err => {
                            reject(err);
                        })
                }catch (e) {
                    reject(e);
                }
            })
        },
    }
    
};
