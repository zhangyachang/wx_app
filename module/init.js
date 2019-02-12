/* 初始化微信的access_token */
const config = require('../config/wx_config'),
    axios = require('axios');

module.exports = {
  init() {
    this.getAccessToken();
    this.auto_refreshAccessToken();
  },
  auto_refreshAccessToken(){
    // 每隔7000s去刷新一次 access_token
    setInterval(() => {
      console.log('access_token刷新函数执行了');
      this.getAccessToken();
    }, 7000000);
  },
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
  }
};
