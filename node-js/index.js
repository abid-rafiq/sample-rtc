var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var doctors = require('./data.json');

app.get('/get-doctors', (req, res) => {
  res.header(
    'Access-Control-Allow-Origin', '*'
  );
  res.send(JSON.stringify(doctors));
});

// function fillDoctorsInRoom() {
//   doctors.forEach((element, index) => {
//     if (io.sockets?.adapter?.rooms['DoctorsRoom']) {
      
//     }
//   });
// }

io.on('connection', (socket) => {
  console.log(socket);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  
  socket.on('ouch', (abc) => {
    console.log('User sent an Ouch');
  });
  
  socket.on('message', (abc) => {
    console.log('The message:', abc);
  });

  socket.on('create-join', function(room) {
    console.log('Received request to create or join room ' + room);

    var clientsInRoom = io.sockets.adapter.rooms[room];
    var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
    console.log('Room ' + room + ' now has ' + numClients + ' client(s)');

    if (numClients === 0) {
      socket.join(room);
      console.log('Client ID ' + socket.id + ' created room ' + room);
      socket.emit('created', room, socket.id);
    } else if (numClients === 1) {
      console.log('Client ID ' + socket.id + ' joined room ' + room);
      // io.sockets.in(room).emit('join', room);
      socket.join(room);
      
      socket.emit('joined', room, socket.id); // Specific to user who sent room id

      io.sockets.in(room).emit('ready', room); // To All Users in that room
      socket.broadcast.emit('ready', room); // To All Users in that room
    } else { // max two clients
      socket.emit('full', room);
    }
  });
});

io.emit('doctors-list', JSON.stringify(doctors));

http.listen(3000, () => {
  console.log('listening on *:3000');
});