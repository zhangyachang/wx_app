module.exports = {
  port: 3000,  //监听的端口号
  app: {
    appId: "wx5a6f4750ba3ee7e6", // 需要修改的
    secret: "096707e8c3caefa57b83186cf9875d7c" // 需要修改的
  },
  url: {
    /*
      下面的接口地址 如果 是post请求  P_
        如果是get请求  G_
     */
    ip: 'https://api.weixin.qq.com',
    getAccessTokenUrl: '/cgi-bin/token?grant_type=client_credential', // 获取token的url地址
    P_CustomSend: '/cgi-bin/message/custom/send', // 发送客服消息
    
  },
  // 服务器消息推送
  server: {
    EncodingAESKey: 'A38YY71VLkQpYiUe4UKlZAoaBMd1E7BZ4n6HYq5PZBi', // 需要修改的
    
  },
  
  access_token: '',
  pushToken: 'zhangyachang', // 服务器推送Token   // 需要修改的
};
