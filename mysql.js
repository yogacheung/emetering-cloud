/*************************************
* Name: eMetering Cloud - mysql.js   *
* Version: 1.0.0                     *
* Node Module: hapi, mysql, md5, joi *
* Date: 10 July 2018                 *
* By Yoga Cheung                     *
**************************************/

///////////////////////////////////////////////////////////
/* DEFINE */
///////////////////////////////////////////////////////////

var mysql = require('mysql');
var log = console.log.bind(console);

var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'yoga@0101',
  //password: 'weshallovercomesomeday',
  database: 'eMeter'
});

exports.query = pool.query.bind(pool);

///////////////////////////////////////////////////////////                                              
/* ERROR LOG */                                                                                          
///////////////////////////////////////////////////////////                                              
          
// If needed

///////////////////////////////////////////////////////////
/* DEVICES */
///////////////////////////////////////////////////////////

// List
exports.devicesList = function(callback) {
  var stmt = "SELECT * FROM devices;";
  pool.query(stmt, function(err, result){
    if(err) callback(err, null);
    else callback(null, result);
  });
}

// Adopting
exports.adopting = function(device_id, callback){
  var stmt = "UPDATE devices SET adopted = true WHERE device_id = ?;";
  pool.query(stmt, device_id, function(err, result){
    if(err) callback(err, null);
    else callback(null, result);
  });
}

//------------------------ END --------------------------//
