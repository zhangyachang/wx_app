const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    {join} = require('path'),
    {port} = require('./config');



app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(bodyParser.json(join(__dirname, 'public')));

app.use('/', express.static('public'));

app.use('/', require('./router/index'));


app.listen(port, () => {
  console.log(port+'端口服务启动成功');
});