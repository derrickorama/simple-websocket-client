var pathlib = require('path');
var chai = require('chai');
var WebSocket = require(pathlib.join(__dirname, '..', 'index')).WebSocket;

chai.should();

describe('basic functionality', function () {
  'use strict';

  var currentWS;
  var status;
  var WebSocketServer;
  var wss;

  beforeEach(function () {
    status = {
      connected: false,
      closed: false
    };
    WebSocketServer = require('ws').Server;
    wss = new WebSocketServer({ port: 8080 });

    wss.on('connection', function connection (ws) {
      currentWS = ws;
      status.connected = true;

      ws.on('close', function () {
        status.closed = true;
      });
    });
  });

  afterEach(function () {
    wss.close();
  });

  it('connects to a web socket', function (done) {
    var socket = new WebSocket('ws://localhost:8080');
    socket.on('open').then(function () {
      status.connected.should.be.true;
      done();
    }).catch(done);
  });


  it('disconnects from a web socket', function (done) {
    var socket = new WebSocket('ws://localhost:8080');
    socket.on('open').then(function () {
      currentWS.close();
      socket.on('close').then(function () {
        // wait a moment
        setTimeout(function () {
          status.closed.should.be.true;
          done();
        });
      }).catch(done);
    }).catch(done);
  });

  it('allows you to subscribe to specific events', function (done) {
    var socket = new WebSocket('ws://localhost:8080');
    socket.on('open').then(function () {
      socket.on('someEvent').then(function () {
        done();
      });
      currentWS.send(JSON.stringify({ action: 'someEvent', data: '' }));
    }).catch(done);
  });

  it('subscribes to the event and executes the callback every time the event occurs', function (done) {
    var callCount = 0;
    var socket = new WebSocket('ws://localhost:8080');
    socket.on('open').then(function () {
      socket.on('someEvent').then(function () {
        callCount++;
        if (callCount === 2) {
          done();
        }
      });
      currentWS.send(JSON.stringify({ action: 'someEvent', data: '' }));
      currentWS.send(JSON.stringify({ action: 'someEvent', data: '' }));
    }).catch(done);
  });

  it('ignores events without subscribers', function (done) {
    var socket = new WebSocket('ws://localhost:8080');
    socket.on('open').then(function () {
      currentWS.send(JSON.stringify({ action: 'noSubscribers', data: '' }));
      setTimeout(function () {
        done();
      }, 20);
    }).catch(done);
  });

  it('handles invalid JSON messages', function (done) {
    var socket = new WebSocket('ws://localhost:8080');
    socket.on('open').then(function () {
      currentWS.send(JSON.stringify('I am not JSON'));
      setTimeout(function () {
        done();
      }, 20);
    }).catch(done);
  });

  it('receives data for a specified event', function (done) {
    var socket = new WebSocket('ws://localhost:8080');
    socket.on('open').then(function () {
      socket.on('someEvent').then(function (data) {
        data.should.eql({ my: 'data' });
        done();
      });
      currentWS.send(JSON.stringify({ action: 'someEvent', data: { my: 'data' } }));
    }).catch(done);
  });

});
