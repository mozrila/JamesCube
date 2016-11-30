var express = require('express');
var cfenv = require('cfenv');

var http = require('http');
var socketio = require('socket.io');
var fs = require('fs');

var device = require('express-device');
var rs = require('randomstring');

var app = express();
httpServer = http.createServer(app);
io = socketio(httpServer);

app.use(express.static(__dirname + '/public'));
app.use(device.capture());

var appEnv = cfenv.getAppEnv();

httpServer.listen(appEnv.port);

// Client HTML
app.get('/', function(req,res) {
  var deviceType = req.device.type.toUpperCase();
  res.setHeader('Content-Type', 'text/html');
  if(deviceType == "DESKTOP")
    res.send(fs.readFileSync('./client/index_pc.html'));
  else
    res.send(fs.readFileSync('./client/index_mobile.html'));
});

// GameServer Logic

io.on('connection', function(socket){

  // Host
  socket.on('create_lobby', function(data) {
    var lobbyID = rs.generate(4).toUpperCase();
    socket.emit("create_lobby", {lobbyID: lobbyID});
  });

  // Client
  socket.on('join_lobby', function(data){
    console.log(data);
    socket.broadcast.emit('user_joined', {name: data.name});
  });

  socket.on('draw_pic', function(data){
    socket.broadcast.emit('draw_pic', data);
  });
});
