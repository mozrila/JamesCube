var socket = io();

var room;
socket.emit('create_lobby', function(lobbyID) {
  room = lobbyID;
  document.getElementById("roomCode").innerHTML = lobbyID;
});

$('#liarliar').click(function() {
  socket.emit('create_game', {gameType: 'liarliar', room: room}, function(data) {
    if(data)
      window.location = "/liarliar"+"?room="+room;
    else
      console.log('err starting game');
  });
});

var users = {};
socket.on('user_joined', function(userData){
  for(var i = 1; i < 9; i++)
    if(users[i] === undefined) {
      users[i] = userData;
      //document.getElementById('image'+i).src = "https://robohash.org/"+userData.name;
      console.log(socket.id)
      document.getElementById('image'+i).src = "https://api.adorable.io/avatars/285/"+userData.id.substring(userData.id.length-5, userData.length);
      //document.getElementById('image'+i).src = "http://eightbitavatar.herokuapp.com/?id="+userData.name+"&s="+userData.sex+"&size=100";
      document.getElementById('user'+i).innerHTML = userData.name;
      break;
    }
});

socket.on('client_drop', function(data){
  for(var i = 1; i < 11; i++)
    if(users[i] !== undefined && users[i].id == data.id) {
      console.log('found')
      users[i] = undefined;
      document.getElementById('image'+i).src = "/images/no_user.png";
      document.getElementById('user'+i).innerHTML = "";
      break;
    }
});
