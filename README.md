# simple-websocket-client

A simple websocket client based on "[ws](https://github.com/websockets/ws)" that uses promises and JSON emissions.

*Requires Node v0.12.x+*

## Usage Example

    var WebSocket = require('simple-websocket-client').WebSocket;
    var socket = new WebSocket('ws://my-domain.com:8080');
    
    socket.on('open').then(function () {
      console.log('connected');
    
      socket.emit('aMessage', {
        my: 'data'
      });
    });
    
    socket.on('someMessage').then(function (jsonData) {
      console.log(jsonData);
    });
    
    socket.on('close').then(function () {
      console.log('disconnected');
    });

# Testing

*Uses mocha*

    npm test
    mocha test/specfilenameSpec.js
