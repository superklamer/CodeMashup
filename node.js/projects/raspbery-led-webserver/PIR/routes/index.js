module.exports = function(io) {
  var express = require('express');
  var router = express.Router();
  var pir = require('../scripts/pirControl');
  var sensor = require('../scripts/magentic_sensor');

  var armed = false;

  io.on('connection', (socket) => {
    socket.emit('connected', {
      payload: 'Hello from server. You are connected'
    });

    socket.on('getSystemStatus', (callback) => {
      callback(armed);
    });

    socket.on('btnPressed', (btnPressed) => {
      console.log('Button pressed - ' + btnPressed);
      if (btnPressed === 'btn-on') {
        armed = true;
        // execute functions to turn pir, magent and light on
        pir.pirWatch();
        sensor.sensorWatch();
      } else if (btnPressed === 'btn-on-window') {
        armed = true;
        sensor.sensorWatch();
      } else if (btnPressed === 'btn-on-motion') {
        armed = true;
        pir.pirWatch();
      } else {
        armed = false;
        // execute functions to turn pir, magent and light off
        pir.unwatch();
        sensor.unwatch();
      }

      io.emit('newSystemStatus', armed, btnPressed);
    });
  });

  /* GET home page. */
  router.get('/', function(req, res, next) {
    var secSystemStatus = (armed ? "Armed": "Disarmed");
    res.render('index', { 
      title: 'Welcome to VR Security',
      subtitle: secSystemStatus
    });
  });

  return router;
};




