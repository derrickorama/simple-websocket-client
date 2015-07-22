var pathlib = require('path');
var chai = require('chai');
var WebSocket = require(pathlib.join(__dirname, '..', 'index')).WebSocket;

chai.should();

describe('emissions', function () {
  'use strict';

  var messages;
  var WebSocketServer;
  var wss;

  beforeEach(function () {
    messages = [];
    WebSocketServer = require('ws').Server;
    wss = new WebSocketServer({ port: 8080 });

    wss.on('connection', function connection (ws) {
      ws.on('message', function (message) {
        messages.push(message);
      });
    });
  });

  afterEach(function () {
    wss.close();
  });

  it('can emit messages through the web socket', function (done) {
    var socket = new WebSocket('ws://localhost:8080');
    socket.on('open').then(function () {
      socket.emit('hello');
      setTimeout(function () {
        messages.length.should.equal(1);
        done();
      }, 20);
    }).catch(done);
  });

  it('can emit messages through the web socket', function (done) {
    var socket = new WebSocket('ws://localhost:8080');
    socket.on('open').then(function () {
      socket.emit('hello', {
        some: 'data'
      });
      setTimeout(function () {
        messages[0].should.eql(JSON.stringify({
          action: 'hello',
          data: {
            some: 'data'
          }
        }));
        done();
      }, 20);
    }).catch(done);
  });

});
