const mysql = require('mysql');
 
const pool = mysql.createPool({
    connectionLimit: 10,
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.MYSQL_DB,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
});

let elevator = {};

elevator.Elevator_List = ( request ) => {
    return new Promise ( function(resolve, reject) {
  
      let filter = 'all';
      if ( request.filter ) filter = request.filter;
  
      let sorted = 'id';
      if ( request.sorted ) sorted = request.sorted;
  
      let id = '0';
      if ( request.id ) id = request.id;
  
      console.log('Elevator_List filter = ',request);
  
      if ( filter == 'all' )
      pool.query("SELECT e.id, e.elevator_name, e.adress, e.owner, e.complex, e.silo, e.warehouse, e.comments, f.name FROM `elevators`.`elevator` AS e LEFT JOIN `elevators`.`firm` AS f ON e.owner = f.id ORDER by " + sorted, function (err, result) {
        if (err) resolve(err);
        console.log('Elevator_List = ',result);
        resolve(result);
      });
  
      if ( filter == 'owner' )
      pool.query("SELECT e.id, e.elevator_name, e.adress, e.owner, e.complex, e.silo, e.warehouse, e.comments, f.name FROM `elevators`.`elevator` AS e LEFT JOIN `elevators`.`firm` AS f ON e.owner = f.id WHERE e.owner = " + id + " ORDER by " + sorted, function (err, result) {
        if (err) resolve(err);
        console.log(result);
        resolve(result);
      });
  
    })
};
  
elevator.Elevator_Data = ( request ) =>{
    console.log(request);
  
    return new Promise ( function(resolve, reject) {
      pool.query("SELECT * FROM `elevators`.`elevator` WHERE id = " + request.id, function (err, result) {
        if (err) resolve(err);
  
        console.log(result);
        resolve(result);
      })
    })
};


module.exports = elevator;