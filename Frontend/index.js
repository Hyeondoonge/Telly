const http = require('http');
const server = http.createServer();

const port = 3003;
const host = 'localhost';

server.listen(port, host, 5000, function(){
  console.log('web server Strat!');
});

server.on('connection', function(socket){
  console.log('client socket : '+socket);
});

server.on('request', function(req, res){
  console.log('client request ');
  res.writeHead(200, {"Content-Type": "text/html; charset=utf8"});
  res.write('<h1>웹서버로부터 받은 응답</h1>');
  res.end();
});
