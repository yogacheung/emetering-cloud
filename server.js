/*************************************
* Name: eMetering Cloud - server.js  *
* Version: 1.0.0                     *
* Node Module: hapi, mysql, md5, joi *
* Date: 10 July 2018                 *
* By Yoga Cheung                     *
**************************************/

///////////////////////////////////////////////////////////
/* DEFINE */
///////////////////////////////////////////////////////////

const Hapi = require('hapi');
const Vision = require('vision');
const Inert = require('inert');
const Lout = require('lout');

var md5 = require('md5');
var Joi = require('joi');
var db = require('./mysql.js');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    secureConnection: true, // use SSL
    port: 465, // port
    auth: {
      user: 'yauka0215@gmail.com',
      pass: 'cyk910215'
    }
});

var log = console.log.bind(console);
const server = Hapi.Server({ 
  port: 3000,
  host: 'localhost',
  routes: {cors: true}
});

const init = async () => {
  await server.register(Vision);
  await server.register(Inert);
  await server.register(Lout);
  await server.start();

  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();

///////////////////////////////////////////////////////////
/* TEST */
///////////////////////////////////////////////////////////

server.route({
    method: 'GET',
    path: '/test',
    handler: (request, h) => {
      return 'This is test route!';
    }
});

///////////////////////////////////////////////////////////
/* ERROR LOG */
///////////////////////////////////////////////////////////

// If needed

///////////////////////////////////////////////////////////
/* ADMIN */
///////////////////////////////////////////////////////////

// Login
server.route({
  method: 'POST',
  path: '/login',
  handler: (request, h) => {
    var data = request.payload;
    //log(data);
    return new Promise((resolve, reject) => {
      db.login(data, function(err, result){
        if (err == null) return resolve(result);
        else return resolve(err);      
      });
  });
  }
});

// Update Password
server.route({
  method: 'POST',
  path: '/updatepw',
  handler: (request, h) => {
    var data = request.payload;
    //log(data);
    return new Promise((resolve, reject) => {
      db.updatePW(data, function(err, result){
        if (err == null) return resolve({"msg":"Success"});
        else return resolve(err);      
      });
    });
  }
});

///////////////////////////////////////////////////////////
/* READING */
///////////////////////////////////////////////////////////

// Current reading
server.route({
  method: 'GET',
  path: '/currentreading',
  handler: (request, h) => {
    return new Promise((resolve, reject) => {
      db.currentReading(function(err, list){  
        //log(list);
        if(err == null) return resolve(list);
          else return resolve(err);
      });
    });
  }
});

// Montly reading
server.route({
  method: 'GET',
  path: '/monthlyreading/{id*2}',  
  handler: (request, h) => {
    var id = request.params.id.split('/');

    var endDate = id[0];
    var tlength = id[1];
    var startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth()-1);
    //return startDate;    
    return new Promise((resolve, reject) => {
      db.monthlyReading(startDate, endDate, function(err, list){
        //log(list);
        if(err == null) return resolve(list);
        else return resolve(err);
      });    
    });
  }
});

//------------------------ END --------------------------//
