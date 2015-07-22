var pathlib = require('path');
var chai = require('chai');
var WebSocket = require(pathlib.join(__dirname, '..', 'index')).WebSocket;

chai.should();

describe('commands', function () {
  'use strict';

  var currentWS;
  var messages;
  var WebSocketServer;
  var wss;

  beforeEach(function () {
    messages = [];
    WebSocketServer = require('ws').Server;
    wss = new WebSocketServer({ port: 8080 });

    wss.on('connection', function connection (ws) {
      currentWS = ws;
      ws.on('message', function (message) {
        messages.push(message);
      });
    });
  });

  afterEach(function () {
    wss.close();
  });

  it('allows you to see if the connection is active (when opened)', function (done) {
    var socket = new WebSocket('ws://localhost:8080');
    socket.on('open').then(function () {
      socket.isConnected().should.be.true;
      done();
    }).catch(done);
  });

  it('allows you to see if the connection is active (when closed)', function (done) {
    var socket = new WebSocket('ws://localhost:8080');
    socket.on('open').then(function () {
      socket.on('close').then(function () {
        socket.isConnected().should.be.false;
        done();
      }).catch(done);
      currentWS.close();
    });
  });

  it('allows you to see if the connection is active (before it\'s opened)', function (done) {
    var socket = new WebSocket('ws://localhost:8080');
    socket.isConnected().should.be.false;
    socket.on('open').then(function () {
      done();
    }).catch(done);
  });

  it('allows you to close the connection', function (done) {
    var socket = new WebSocket('ws://localhost:8080');
    socket.on('open').then(function () {
      socket.close();
    }).catch(done);
    socket.on('close').then(function () {
      done();
    }).catch(done);
  });

});
