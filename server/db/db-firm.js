const mysql = require('mysql');
 
const pool = mysql.createPool({
    connectionLimit: 10,
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.MYSQL_DB,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
});

let firm = {};

firm.Firm_List = ( request ) => {
    return new Promise ( function(resolve, reject) {
      console.log('filter = ', request);
      let filter = 'all';
      if ( request.filter ) filter = request.filter;
  
      let sorted = 'id';
  
      let list = 'simple';
      if ( request.list ) list = request.list;
      if ( request.sorted ) sorted = request.sorted;
  
      let id = '0';
      if ( request.id ) id = request.id;
  
      //if ( request.filter == 'all' ) 
        if ( list == 'simple')
        pool.query("SELECT * FROM `elevators`.`firm` ORDER BY " + sorted, function (err, result) {
            if (err) resolve(err);
            console.log(result);
            resolve(result);
          });
  
      if ( list == 'contact') 
        pool.query("SELECT f.id, p.firm, p.elevator, e.elevator_name, p.name, p.surname, p.position, p.phone, p.comments FROM `elevators`.`firm` AS f LEFT JOIN `elevators`.`person` AS p ON f.id = p.firm LEFT JOIN `elevators`.`elevator` AS e ON e.id = p.elevator WHERE f.id = " + id + " ORDER BY e.elevator_name", function (err, result) {
          if (err) resolve(err);
          console.log(result);
          resolve(result);
        });
  
      if ( request.filter == 'id' ) 
        pool.query("SELECT * FROM `elevators`.`firm` WHERE id = '" + request.id + "'", function (err, result) {
          if (err) resolve(err);
          console.log(result);
          resolve(result);
        });
    })
  };
  
  firm.Firm_Data = ( request ) => {
    console.log(request);
    return new Promise ( function(resolve, reject) {
      pool.query("SELECT * FROM `elevators`.`firm` WHERE id = " + request.id, function (err, result) {
        if (err) resolve(err);
        console.log(result);
        resolve(result);
      })
    })
  };

  module.exports = firm;