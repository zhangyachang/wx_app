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
      this.getAccessToken();
    }, 7000000);
  },
  getAccessToken(){
    return new Promise((resolve, reject) => {
      axios.get(`${config.url.ip}${config.url.getAccessTokenUrl}&appid=${config.app.appId}&secret=${config.app.secret}`)
          .then(res => {
            console.log('获取access_token成功');
            // console.log(res.data);
            config.access_token = res.data.access_token;
            resolve({status: 200, msg: 'ok'});
          })
          .catch(err => {
            console.log('获取access_token失败，请检查程序逻辑');
            console.log(err);
            reject({status: 400, msg: 'err'})
          });
    })
  }
};
