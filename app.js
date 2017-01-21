var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');


var logger = require('morgan')
var wechat = require('wechat');
var OAuth = require('wechat-oauth');
var client = new OAuth('wx6a619f74fe901a24', '37fa566f9fa93d0cb1761aeaeccaff4f');


// 37fa566f9fa93d0cb1761aeaeccaff4f
var config = {
    token: 'node',
    appid: 'wx6a619f74fe901a24',
    encodingAESKey: 'vxCRfKm9MBJdeI7gh4QrrqzephCyZNVEP9SpFgDVXQR'
};

app.use(express.query());

app.use(logger('dev'));
app.use(cookieParser());


app.set('views', '../index/index');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , Code, yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
        /让options请求快速返回/
    } else {
        next();
    }
});
app.use(express.static(path.normalize(__dirname + './index')));
app.use("/public", express.static(path.normalize(__dirname + './public')));

app.use('/wechat', wechat(config, function(req, res, next) {
    // 微信输入信息都在req.weixin上
    var message = req.weixin;
    console.log(message)
    if (message.FromUserName === 'diaosi') {
        // 回复屌丝(普通回复)
        res.reply('hehe');
    } else if (message.FromUserName === 'text') {
        //你也可以这样回复text类型的信息
        res.reply({
            content: 'text object',
            type: 'text'
        });
    } else if (message.FromUserName === 'hehe') {
        // 回复一段音乐
        res.reply({
            type: "music",
            content: {
                title: "来段音乐吧",
                description: "一无所有",
                musicUrl: "http://mp3.com/xx.mp3",
                hqMusicUrl: "http://mp3.com/xx.mp3",
                thumbMediaId: "thisThumbMediaId"
            }
        });
    } else if (message.Content === '123') {
        console.log(123)
        var url = client.getAuthorizeURLForWebsite('http://lixue1992.6655.la/', 'state', 'scope');
        res.reply([{
            title: '你来我家接我吧',
            description: '这是女神与高富帅之间的对话',
            picurl: 'http://d.hiphotos.baidu.com/baike/s%3D220/sign=5adaf83fc8177f3e1434fb0f40ce3bb9/43a7d933c895d14326598eaa72f082025aaf070f.jpg',
            url: url
        }]);
    } else {
        // 回复高富帅(图文回复)
        res.reply([{
            title: '你来我家接我吧',
            description: '这是女神与高富帅之间的对话',
            picurl: 'http://d.hiphotos.baidu.com/baike/s%3D220/sign=5adaf83fc8177f3e1434fb0f40ce3bb9/43a7d933c895d14326598eaa72f082025aaf070f.jpg',
            url: 'http://lixue1992.6655.la/'
        }]);
    }
}));



app.get('/', function(req, res) {
    // res.send('Hello World 大富!');
    res.sendFile(path.normalize(__dirname + '/index') + '/index.html');
});

var server = app.listen(80, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});