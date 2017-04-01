var net = require('net');
 
var sockets = [];
 
/*
 * Cleans the input of carriage return, newline
 */
function cleanInput(data) {
	return data.toString().replace(/(\r\n|\n|\r)/gm,"");
}
 
/*
 * Method executed when data is received from a socket
 */
function receiveData(socket, data) {
	var cleanData = cleanInput(data);
	if(cleanData === "@quit") {
		socket.end('Goodbye!\n');
	}
	else {
		for(var i = 0; i<sockets.length; i++) {
			if (sockets[i] !== socket) {
				sockets[i].write(data);
			}
		}
	}
}

function publishData(socket) {
	for(var i = 0; i<sockets.length; i++) {
		socket.write("idle\n");
	}
}

/*
 * Method executed when a socket ends
 */
function closeSocket(socket) {
	var i = sockets.indexOf(socket);
	if (i != -1) {
		sockets.splice(i, 1);
	}
}
 
/*
 * Callback method executed when a new TCP socket is opened.
 */
function newSocket(socket) {
	sockets.push(socket);
	socket.write('Welcome to the Telnet server!\n');
	socket.on('data', function(data) {
		receiveData(socket, data);
		//console.log(data);
	})
	socket.on('end', function() {
		closeSocket(socket);
	})
	socket.on('timeout', function() {
		publishData(socket);
	})
	socket.setTimeout(2000);
}
 
// Create a new server and provide a callback for when a connection occurs
var server = net.createServer(newSocket);
 
// Listen on port 8888
server.listen(80);