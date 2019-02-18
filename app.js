/**
 * Created by easterCat on 2017/9/6.
 */

var app = require("http").createServer(handler);
var io = require("socket.io")(app);
var Redis = require("ioredis");
var redis = new Redis("6379");
var pub = new Redis("6379");

function handler(request, response) {
  response.writeHead(200, { "Content-type": "text/html;charset=utf-8" });
  if (request.url !== "/favicon.ico") {
    //清除第二次访问
    response.write("node_redis");
    response.end("node_redis");
  }
}

//订阅redis_user_chat频道
redis.subscribe("redis_user_chat", function(err, count) {
  pub.publish("redis_user_chat", "我正在监听redis_chat这个频道!");
});

io.on("connection", function(socket) {
  redis.on("message", function(channel, message) {
    // console.log("Receive message %s from channel %s", message, channel);
    if (message) {
      message = JSON.parse(message);
      socket.emit("from_php_chat", message);
    }
  });
});

app.listen(8888);
console.log("server running at http://localhost:8888/");
