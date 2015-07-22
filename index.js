var WebSocket = require('ws');

exports.WebSocket = function (url) {
  'use strict';

  var socket = new WebSocket(url);
  var isConnected = false;
  var events = {};
  var openPromise = new Promise(function (resolve) {
    socket.on('open', function () {
      isConnected = true;
      resolve();
    });
  });
  var closePromise = new Promise(function (resolve) {
    socket.on('close', function () {
      isConnected = false;
      resolve();
    });
  });

  socket.on('message', function (msg) {
    var jsonMSG = JSON.parse(msg);

    if (events.hasOwnProperty(jsonMSG.action) === false) {
      return false;
    }

    events[jsonMSG.action].callbacks.forEach(function (callback) {
      callback(jsonMSG.data);
    });
  });

  return {
    close: function () {
      socket.close();
    },
    emit: function (eventName, data) {
      socket.send(JSON.stringify({
        action: eventName,
        data: data
      }));
    },
    isConnected: function () {
      return isConnected;
    },
    on: function (eventName) {
      switch (eventName) {
        case 'open':
          return openPromise;
        case 'close':
          return closePromise;
        default:
          return subscribeToEvent(events, eventName);
      }
    }
  };
};

function subscribeToEvent(events, eventName) {
  'use strict';

  if (events.hasOwnProperty(eventName) === false) {
    events[eventName] = {
      callbacks: [],
      then: function (callback) {
        events[eventName].callbacks.push(callback);
      }
    };
  }

  return events[eventName];
}
