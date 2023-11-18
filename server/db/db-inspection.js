const mysql = require('mysql');
 
const pool = mysql.createPool({
    connectionLimit: 10,
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.MYSQL_DB,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
});

let inspection = {};

inspection.Inspection_List = ( request ) => {
    return new Promise ( function(resolve, reject) {
      pool.query(
        "SELECT i.id, i.order_no, i.order_date, i.order_time, i.order, " +
        "i.elevator, e.elevator_name, " +
        "i.client, f.name AS 'client_name', " +
        "i.inspector, p.name AS inspector_name, p.surname AS inspector_surname, " +
        "i.comments, i.status, i.result, " + 
        "IF ( i.complex != 'null', 'true', 'false' ) AS complex_found, " +
        "IF ( i.silo != 'null', 'true', 'false' ) AS silo_found, " +
        "IF ( i.warehouse != 'null', 'true', 'false' ) AS warehouse_found " +
        "FROM `elevators`.`inspection` AS i " +
        "LEFT JOIN `elevators`.`elevator` AS e ON i.elevator = e.id " +
        "LEFT JOIN `elevators`.`firm` AS f ON i.client = f.id " +
        "LEFT JOIN `elevators`.`person` AS p ON i.inspector = p.id", function (err, result) {
        if (err) resolve(err);
        console.log('Inspection_List = ',result);
        resolve(result);
      })
    })
};
  
inspection.Inspection_Data = ( request ) => {
    return new Promise ( function(resolve, reject) {
      pool.query(
        "SELECT i.id, i.order_no, i.order_date, i.order_time, i.order, " +
        "i.elevator, e.elevator_name, " +
        "e.adress AS elevator_adress, " +
        "e.owner AS elevator_owner, o.name AS elevator_owner_name, " +
        "e.comments AS elevator_comments, " +
        "i.client, f.name AS 'client_name', " +
        "i.inspector, p.name AS inspector_name, p.surname AS inspector_surname, " +
        "i.comments, i.status, i.result, " + 
        "i.complex, i.silo, i.warehouse " + 
        "FROM `elevators`.`inspection` AS i " +
        "LEFT JOIN `elevators`.`elevator` AS e ON i.elevator = e.id " +
        "LEFT JOIN `elevators`.`firm` AS f ON i.client = f.id " +
        "LEFT JOIN `elevators`.`firm` AS o ON e.owner = o.id " +
        "LEFT JOIN `elevators`.`person` AS p ON i.inspector = p.id " + 
        "WHERE i.id = " + request.id, function (err, result) {
        if (err) resolve(err);
        console.log('Inspection_Data = ',result);
        resolve(result);
      })
    })
};

module.exports = inspection;