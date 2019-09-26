const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {join} = require('path');
const http = require('http');
const morgan = require('morgan');
const init = require('./module/init');
const xmlparser = require('express-xml-bodyparser');
const {port} = require('./config/wx_config');

app.use(morgan('dev'));

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  // res.header("Content-Type", "application/json;charset=utf-8")
  if(req.method=="OPTIONS") res.send(200);
  else next()
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(xmlparser()); /* 为了解析微信的 xml 格式的文件而加入的 */

app.use('/', express.static(join(__dirname, 'public')));

app.use('/', require('./router/index'));


// 初始化 项目的配置等
init.init();

http.createServer(app).listen(port, () => {
  console.log(port+'端口服务启动成功');
});

