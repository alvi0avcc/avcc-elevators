require("dotenv").config();
const os = require('os');
console.log('hostname = ', os.hostname());
const port = ( os.hostname() == 'NITRO' ? 3001 : process.env.APP_PORT );
const host = ( os.hostname() == 'NITRO' ? '127.0.0.1' : process.env.APP_HOST );
console.log('host = ', host, port);
const IN_PROD = process.env.NODE_ENV === 'production';
const ONE_HOURS = 1000 * 60 * 60;
const TWO_HOURS = ONE_HOURS * 2;

const express = require('express');

const https = require('https');
const fs = require('fs');
var https_options = {
  key: fs.readFileSync(`./cert/privkey.pem`),
  cert: fs.readFileSync(`./cert/fullchain.pem`)
};

const bodyParser = require('body-parser');
const app = express();

https.createServer(https_options, app).listen(port, host, () => {
  console.log(`Server listens https://${host}:${port}`);
});

const cors = require("cors");
const morgan = require('morgan');

const session = require('express-session');

const db = require('./db/db');
const { hashSync, genSaltSync, compareSync } = require("bcrypt");

const mysql = require('mysql');
const mysqlStore = require('express-mysql-session')(session);
const options ={
  connectionLimit: 10,
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  database: process.env.MYSQL_DB,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  createDatabaseTable: true
};

const pool = mysql.createPool(options);
const sessionStore = new mysqlStore(options, pool);

/*
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.MYSQL_DB
});
*/

// my modules
const inspection = require('./db/db-inspection');
const elevator = require('./db/db-elevator');
const firm = require('./db/db-firm');
const person = require('./db/db-person');
const user = require('./db/db-user');

app.use(cors({
  //origin: 'https://' + host + ':' + port,
  origin: 'http://localhost:3000',
  //origin: "https://avcc.sytes.net:8433",
  //origin : '*',
  credentials: true
}));

app.use(morgan('dev'));// we  use morgan with the pre-defined format "dev" for developer.
 
app.use(bodyParser.json()); // for parsing application/json

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  name: process.env.SESS_NAME,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  secret: process.env.SESS_SECRET,
  cookie: {
      httpOnly: true,
      maxAge: ONE_HOURS,
      sameSite: 'none',
      secure: true
  },
  rolling: true,
}));


// Attempt to catch disconnects 
pool.on('connection', function (stream) {
  console.log('DB Connection established');

  stream.on('error', function (err) {
    console.error( Date(), 'MySQL error', err.code);
  });
  stream.on('close', function (err) {
    console.error( Date(), 'MySQL close', err);
  });
  stream.on('end', function (err) {
    console.error( Date(), 'MySQL end', err);
  });
  stream.on('timeout', function (err) {
    console.error( Date(), 'MySQL timeout', err);
  });
  stream.on('drain', function (err) {
    console.error( Date() , 'MySQL drain', err);
  });
  stream.on('pause', function (err) {
    console.error( Date(), 'MySQL pause', err);
  });
  stream.on('resume', function (err) {
    console.error( Date(), 'MySQL resume', err);
  });
  stream.on('connect', function (err) {
    console.error( Date(), 'MySQL connect', err);
  });
});


//------- redirects --------------------------------

const checkAuth = (req, res, next) =>{
  if(!req.session.userId){
      //res.redirect('/')
      res.send('error')
  }else{
          next()
      }
};

//-----------------------------------------------------------

app.get('/', (req, res)=>{
  const { userId } = req.session
  console.log(userId);
  res.send(`
  <h1> Welcome!</h1>
  <a href = 'https://avcc.sytes.net/'> AVCC </a>
  `);
});

app.get('/status', (req, res)=>{
  const { userId } = req.session
  console.log(userId);
  res.send(
    ( userId ? {online: true, login: true} : {online: true, login: false} )
  );
});

app.post('/login', async(req, res, next)=>{
  try{ 
  const email = req.body.email;
  let password = req.body.password;
  //const user = await db.getUserByEmail(email).then( resolve => {return res.send( resolve )}, reject => {return res.send( reject )});
  const user = await db.getUserByEmail(email).then( null, reject => { return res.send( reject )});
  if(!user){
      return res.send({
        login: false,
        userId: 0,
        name: '',
        surname: '',
        email: '',
        message: "Invalid email or password"
      })
  }

  const isValidPassword = compareSync(password, user.password);
  if(isValidPassword){
      user.password = undefined;
      req.session.userId = user.id
      //return res.redirect('/home');
      return res.send({
        login: true,
        userId: req.session.userId,
        name: user.name,
        surname: user.surname,
        email: email
      });
  }  else{
       res.send({
        login: false,
        userId: 0,
        name: '',
        surname: '',
        email: '',
        message: "Invalid email or password"
       }
      );
      //return res.redirect('/login')
  } 

  } catch(e){
      console.log(e);
  }
});

/*
app.get('/register',redirectHome, (req,res)=>{
  res.send(`
  <h1>Register</h1>
  <form method='post' action='/Register'>
  <input type='text' name='Name' placeholder='Name' required />
  <input type='text' name='SurName' placeholder='Surname' required />
  <input type='email' name='email' placeholder='Email' required />
  <input type='password' name='password' placeholder='password' required/>
  <input type='submit' />
  </form>
  <a href='/login'>Login</a>
  `)
});
*/

app.post('/register', checkAuth, async (req, res, next)=>{
  try{
      const Name = req.body.Name;
      const SurName = req.body.SurtName;
      const email = req.body.email;
      let password = req.body.password;


            if (!Name || !SurName || !email || !password) {
              return res.sendStatus(400);
           }

           const salt = genSaltSync(10);
           password = hashSync(password, salt);

            

      const user =  await db.insertUser(Name, SurName, email, password).then( insertId => { return db.getUser(insertId); });
      req.session.userId = user.id
          return res.redirect('/register') 

  } catch(e){    
      console.log(e);
      res.sendStatus(400);
  }
});


app.post('/logout', (req, res)=>{
  req.session.destroy(err => {
      if(err){
          return res.redirect('/home')
      }
      sessionStore.close()
      res.clearCookie(process.env.SESS_NAME)
      //res.redirect('/login');
      res.send({
        login: false,
      });
  })

})

//---request information from server ---

app.post("/info", checkAuth, async (request, response, next) => {
  try {
    await db.getUser( request.session.userId ).then( users => { 
      const user = users[0];
      console.log("user id = ", user.id);
      console.log("user email = ", user.email);
      const req = request.body;
      console.log("request = ", req);

      if ( req.type == 'inspections') {
        if ( user.inspection_read == 1 ) {
          if ( req.filter == 'all' ) inspection.Inspection_List( req ).then( result => { response.json( { result: result, error: null } ) });
          if ( req.filter == 'id' ) inspection.Inspection_Data( req ).then( result => { response.json( { result: result, error: null } ) });
        }
        else response.json( { result: null, error: 'You don`t have permission for read `Inspection` DB.' } )
      }
      else if ( req.type == 'elevators') {
        if ( user.elevator_read == 1 ) {
          if ( req.filter == 'all' ) elevator.Elevator_List( req ).then( result => { response.json( { result: result, error: null } ) });
          if ( req.filter == 'id' ) elevator.Elevator_Data( req ).then( result => { response.json( { result: result, error: null } ) });
        }
        else response.json( { result: null, error: 'You don`t have permission for read `Elevator` DB.' } )
      }
      else if ( req.type == 'firms') {
        if ( user.firm_read == 1 ) {
          if ( req.filter == 'all' ) firm.Firm_List( req ).then( result => { response.json( { result: result, error: null } ) });
        }
        else response.json( { result: null, error: 'You don`t have permission for read `Firm` DB.' } )
      }
      else if ( req.type == 'persons') {
        if ( user.person_read == 1 ) {
          if ( req.filter == 'all' ) Person_List( req ).then( result => { response.json( { result: result, error: null } ) });
        }
        else response.json( { result: null, error: 'You don`t have permission for read `Person` DB.' } )
      }
      else if ( req.type == 'users') {
        if ( user.user_read == 1 ) {
          if ( req.filter == 'all' ) User_List( req ).then( result => { response.json( { result: result, error: null } ) });
        }
        else response.json( { result: null, error: 'You don`t have permission for read `User` DB.' } )
      }
      else response.json( { result: null, error: 'incorrect request', request: req } );
    })
  } catch(e) { console.log(e); }
});

/*

app.post("/elevatorinfo", (request, response) => {
  console.log('Elevator info: ',request.body);
  if ( request.isAuthenticated )
    Elevator_List( request.body ).then(function(result){ console.log("Elevator_List response:", result); response.json( result ) });
});

app.post("/elevatordata", (request, response) => {
  console.log('Elevator data: ',request.body);
  if ( request.isAuthenticated )
    Elevator_Data( request.body ).then(function(result){ console.log("Elevator_Data response:", result); response.json( result ) });
});

app.post("/importcomplex", (request, response) => {
  console.log('import complex: ',request.body);
  if ( request.isAuthenticated )
    Import_Complex( request.body ).then(function(result){ console.log("import complex response:", result); response.json( result ) });
});

app.post("/importsilo", (request, response) => {
  console.log('import silo: ',request.body);
  if ( request.isAuthenticated )
    Import_Silo( request.body ).then(function(result){ console.log("import silo response:", result); response.json( result ) });
});

app.post("/importwarehouse", (request, response) => {
  console.log('import warehouse: ',request.body);
  if ( request.isAuthenticated )
    Import_Warehouse( request.body ).then(function(result){ console.log("import warehouse response:", result); response.json( result ) });
});

app.post("/firminfo", (request, response) => {
  console.log('Firm info: ',request.body);
  if ( request.isAuthenticated )
    Firm_List( request.body ).then(function(result){ console.log("Firm_List response:", result); response.json( result ) });
});

app.post("/firmdata", (request, response) => {
  console.log('Firm data: ',request.body);
  if ( request.isAuthenticated )
    Firm_Data( request.body ).then(function(result){ console.log("Firm_Data response:", result); response.json( result ) });
});

app.post("/personinfo", (request, response) => {
  console.log('Person info: ',request.body);
  if ( request.isAuthenticated )
    Person_List( request.body ).then(function(result){ console.log("Person_List response:", result); response.json( result ) });
});

app.post("/persondata", (request, response) => {
  console.log('Person data: ',request.body);
  if ( request.isAuthenticated )
    Person_Data( request.body ).then(function(result){ console.log("Person_Data response:", result); response.json( result ) });
});

app.post("/userinfo", (request, response) => {
  console.log('User info: ',request.body);
  console.log('User info user: ',request.user);
  if ( request.isAuthenticated )
    User_List( request.body ).then(function(result){ console.log("User_List response:", result); response.json( result ) });
});

app.post("/userndata", (request, response) => {
  console.log('User data: ',request.body);
  if ( request.isAuthenticated )
    User_Data( request.body ).then(function(result){ console.log("User_Data response:", result); response.json( result ) });
});

app.post("/newinspection", (request, response) => {
  console.log('new_inspection: ',request.body);
  if ( request.isAuthenticated )
    New_Inspection( request.body ).then(function(result){ console.log("New_Inspection response:", result); response.json( result ) });
});

app.post("/updateinspection", (request, response) => {
  console.log('update_inspection: ',request.body);
  if ( request.isAuthenticated )
    Update_Inspection( request.body ).then(function(result){ console.log("Update_INspection response:", result); response.json( result ) });
});

app.post("/delinspection", (request, response) => {
  console.log('del_inspection: ',request.body);
  if ( request.isAuthenticated )
    Del_Inspection( request.body ).then(function(result){ console.log("Del_Inspection response:", result); response.json( result ) });
});

app.post("/newelevator", (request, response) => {
  console.log('new_elevator: ',request.body);
  if ( request.isAuthenticated )
    New_Elevator( request.body ).then(function(result){ console.log("New_Elevator response:", result); response.json( result ) });
});

app.post("/updateelevator", (request, response) => {
  console.log('update_elevator: ',request.body);
  if ( request.isAuthenticated )
    Update_Elevator( request.body ).then(function(result){ console.log("Update_Elevator response:", result); response.json( result ) });
});

app.post("/delelevator", (request, response) => {
  console.log('del_elevator: ',request.body);
  if ( request.isAuthenticated )
    Del_Elevator( request.body ).then(function(result){ console.log("Del_Elevator response:", result); response.json( result ) });
});

app.post("/newfirm", (request, response) => {
  console.log('new_firm: ',request.body);
  if ( request.isAuthenticated )
    New_Firm( request.body ).then(function(result){ console.log("New_Firm response:", result); response.json( result ) });
});

app.post("/delfirm", (request, response) => {
  console.log('del_firm: ',request.body);
  if ( request.isAuthenticated )
    Del_Firm( request.body ).then(function(result){ console.log("Del_Firm response:", result); response.json( result ) });
});

app.post("/updatefirm", (request, response) => {
  console.log('update_firm: ',request.body);
  if ( request.isAuthenticated )
    Update_Firm( request.body ).then(function(result){ console.log("Update_Firm response:", result); response.json( result ) });
});

app.post("/newperson", (request, response) => {
  console.log('new_person: ',request.body);
  if ( request.isAuthenticated )
    New_Person( request.body ).then(function(result){ console.log("New_Person response:", result); response.json( result ) });
});

app.post("/delperson", (request, response) => {
  console.log('del_person: ',request.body);
  if ( request.isAuthenticated )
    Del_Person( request.body ).then(function(result){ console.log("Del_Person response:", result); response.json( result ) });
});

app.post("/updateperson", (request, response) => {
  console.log('update_person: ',request.body);
  if ( request.isAuthenticated )
   Update_Person( request.body ).then(function(result){ console.log("Update_Person response:", result); response.json( result ) });
});

*/

//----------------------------------------------------------

/*
function SignIn( login, password ){
  return new Promise ( function(resolve, reject) {
    connection.query("SELECT u.*, p.name, p.surname FROM `elevators`.`users` AS u LEFT JOIN `elevators`.`person` AS p ON u.person_id = p.id WHERE username = '"+ login +"'", function (err, result) {
      if (err) resolve(err);

      let db_response = null;

      if ( result[0] ) {
        console.log('user found. username = ',result[0].username);
        db_response = result[0];
        if ( result[0].password == password ) db_response.password = 'ok'
          else db_response.password = 'password error'
      } else {
        console.log('user not found');
        db_response = 'user not found';
      }
      resolve(db_response);
    })
  })
};
*/

function Import_Complex( request ){
  return new Promise ( function(resolve, reject) {
    pool.query("UPDATE `elevators`.`elevator` SET `complex` = '" + request.data + "' WHERE id = " + request.id, function (err, result) {

      if (err) resolve(err);

      console.log(result);
      resolve(result);
    })
  })
};

function Import_Silo( request ){
  return new Promise ( function(resolve, reject) {
    pool.query("UPDATE `elevators`.`elevator` SET `silo` = '" + request.data + "' WHERE id = " + request.id, function (err, result) {

      if (err) resolve(err);

      console.log(result);
      resolve(result);
    })
  })
};

function Import_Warehouse( request ){
  return new Promise ( function(resolve, reject) {
    pool.query("UPDATE `elevators`.`elevator` SET `warehouse` = '" + request.data + "' WHERE id = " + request.id, function (err, result) {

      if (err) resolve(err);

      console.log(result);
      resolve(result);
    })
  })
};



function Person_List( request ){
  return new Promise ( function(resolve, reject) {
    console.log('filter = ', request);

    let id = '0';
    if ( request.id ) id = request.id;

    let sort = 'id';
    if ( request.sort ) sort = request.sort;

    let list = 'person';
    if ( request.list ) list = request.list;

    let filter = 'all';
    if ( request.filter ) filter = request.filter;

    if ( list == 'person' && filter == 'all' ) 
      pool.query("SELECT p.id, p.name, p.surname, p.firm, p.elevator, p.position, p.phone, p.comments, f.name AS firm_name, e.elevator_name FROM `elevators`.`person` AS p LEFT JOIN `elevators`.`firm` AS f ON p.firm = f.id LEFT JOIN `elevators`.`elevator` AS e ON p.elevator = e.id ORDER BY " + sort, function (err, result) {
        if (err) resolve(err);
        console.log(result);
        resolve(result);
      });

    if ( list == 'inspector' && filter == 'all' ) 
      pool.query("SELECT * FROM `elevators`.`person` WHERE position = '" + list + "'  ORDER BY " + sort, function (err, result) {
        if (err) resolve(err);
        console.log(result);
        resolve(result);
      });

    if ( list == 'person' && filter == 'id' ) 
      pool.query("SELECT * FROM `elevators`.`person` WHERE id = '" + request.id + "'", function (err, result) {
        if (err) resolve(err);
        console.log(result);
        resolve(result);
      });
    
    if ( list == 'firm') 
      pool.query("SELECT f.id, p.firm, p.elevator, e.elevator_name, p.name, p.surname, p.position, p.phone, p.comments FROM `elevators`.`firm` AS f LEFT JOIN `elevators`.`person` AS p ON f.id = p.firm LEFT JOIN `elevators`.`elevator` AS e ON e.id = p.elevator WHERE f.id = " + id + " ORDER BY e.elevator_name", function (err, result) {
        if (err) resolve(err);
        console.log(result);
        resolve(result);
      });

    if ( list == 'elevator') 
      pool.query("SELECT e.id, p.elevator, p.name, p.surname, p.position, p.phone, p.comments FROM `elevators`.`elevator` AS e LEFT JOIN `elevators`.`person` AS p ON e.id = p.elevator WHERE e.id = '" + id + "' ORDER BY p.position", function (err, result) {
        if (err) resolve(err);
        console.log(result);
        resolve(result);
      });
  })
};

function Person_Data( request ){
  console.log(request);
  return new Promise ( function(resolve, reject) {
    pool.query("SELECT * FROM `elevators`.`person` WHERE id = " + request.id, function (err, result) {
      if (err) resolve(err);
      console.log(result);
      resolve(result);
    })
  })
};

function User_List( request ){
  return new Promise ( function(resolve, reject) {


    console.log('filter = ', request);

    let id = '0';
    if ( request.id ) id = request.id;

    let sort = 'id';
    if ( request.sort ) sort = request.sort;
/*
    let list = 'person';
    if ( request.list ) list = request.list;
*/
    let filter = 'all';
    if ( request.filter ) filter = request.filter;

    if ( filter == 'all' ) 
      //connection.query('SELECT u.*, p.name, p.surname FROM `elevators`.`users` AS u LEFT JOIN `elevators`.`person` AS p ON u.person_id = p.id ORDER BY " + sort, function (err, result) {
        pool.query("SELECT *, '***' AS password FROM `elevators`.`users` ORDER BY " + sort, function (err, result) {
        if (err) resolve(err);
        console.log(result);
        resolve(result);
      });

function User_Data( request ){
  console.log(request);
  return new Promise ( function(resolve, reject) {
    pool.query("SELECT * FROM `elevators`.`users` WHERE id = " + request.id, function (err, result) {
      if (err) resolve(err);
      console.log(result);
      resolve(result);
    })
  })
};


/*
    if ( list == 'inspector' && filter == 'all' ) 
      connection.query("SELECT * FROM `elevators`.`person` WHERE position = '" + list + "'  ORDER BY " + sort, function (err, result) {
        if (err) resolve(err);
        console.log(result);
        resolve(result);
      });

    if ( list == 'person' && filter == 'id' ) 
      connection.query("SELECT * FROM `elevators`.`person` WHERE id = '" + request.id + "'", function (err, result) {
        if (err) resolve(err);
        console.log(result);
        resolve(result);
      });
    
    if ( list == 'firm') 
      connection.query("SELECT f.id, p.firm, p.elevator, e.elevator_name, p.name, p.surname, p.position, p.phone, p.comments FROM `elevators`.`firm` AS f LEFT JOIN `elevators`.`person` AS p ON f.id = p.firm LEFT JOIN `elevators`.`elevator` AS e ON e.id = p.elevator WHERE f.id = " + id + " ORDER BY e.elevator_name", function (err, result) {
        if (err) resolve(err);
        console.log(result);
        resolve(result);
      });

    if ( list == 'elevator') 
      connection.query("SELECT e.id, p.elevator, p.name, p.surname, p.position, p.phone, p.comments FROM `elevators`.`elevator` AS e LEFT JOIN `elevators`.`person` AS p ON e.id = p.elevator WHERE e.id = '" + id + "' ORDER BY p.position", function (err, result) {
        if (err) resolve(err);
        console.log(result);
        resolve(result);
      });
      */
  })
};

function New_Inspection( request ){
  return new Promise ( function(resolve, reject) {
    /*
    connection.query("INSERT INTO `elevators`.`inspection` VALUES ( DEFAULT,"+
        "'" + request.order_no +"',"+
        "'" + request.order_date +"',"+
        "DEFAULT,"+//order_time
        "DEFAULT,"+//order
        'DEFAULT,'+//elevator
        "DEFAULT,DEFAULT,DEFAULT"+
  
        ")", function (err, result) {
            console.log('New_Inspection - err - ',err);
            console.log('New_Inspection - result - ',result);
            if (err) resolve(err)
            else resolve(result);
          }
    ); 
    */
    pool.query("INSERT INTO `elevators`.`inspection` (`order_no`, `order_date`)" +
      " VALUES ('" + request.order_no + "', '" + request.order_date + "')",
      function (err, result) {
        console.log('New_Inspection - err - ',err);
        console.log('New_Inspection - result - ',result);
        if (err) resolve(err)
        else resolve(result);
      }
); 
  });
}

function Update_Inspection( request ){
  return new Promise ( function(resolve, reject) {
    if ( request.parameter == 'full' ) {
      console.log('Update_Inspection - request - ',request);
      pool.query("UPDATE `elevators`.`inspection` SET "+
      "`order_no` = '" +  request.order_no + "', " +
      "`order_date` = '" +  request.order_date + "', " +
      "`order_time` = '" +  request.order_time + "', " +
      "`order` = '" +  request.order + "', " +
      "`elevator` = " + ( request.elevator == null || request.elevator == 0 ? "DEFAULT, " : "'" +  request.elevator + "', " ) +
      "`client` = " + ( request.client == null || request.client == 0 ? "DEFAULT, " : "'" +  request.client + "', " ) +
      "`inspector` = " + ( request.inspector == null || request.inspector == 0 ? "DEFAULT, " : "'" +  request.inspector + "', " ) +
      "`comments` = '" +  request.comments + "', " +
      "`status` = " +  ( request.status == null || request.status == '' ? "'0'" : "'" +  request.status + "'" ) + ", " +
      "`result` = " +  ( request.result == null || request.result == '' ? "'0' " : "'" +  request.result + "'" ) +  ", " +
      "`complex` = " + ( request.complex == null || request.complex == '' ? "DEFAULT" : "'" + JSON.stringify( request.complex )  + "'" ) + ", " +
      "`silo` = " + ( request.silo == null || request.silo == '' ? "DEFAULT" : "'" + JSON.stringify( request.silo )  + "'" ) + ", " +
      "`warehouse` = " + ( request.warehouse == null || request.warehouse == '' ? "DEFAULT" : "'" + JSON.stringify( request.warehouse )  + "'" ) +
      " WHERE (`id` = '" + request.id + "')",
        function (err, result) {
          console.log('Update_Inspection - err - ',err);
          console.log('Update_Inspection - result - ',result);
          if (err) resolve(err)
          else resolve(result);
        }
      );
    }

  });
}

function Del_Inspection( request ){
  return new Promise ( function(resolve, reject) {
    pool.query("DELETE FROM `elevators`.`inspection` WHERE (`id` = '"+ request.id + "')",
        function (err, result) {
          console.log('Del_Inspection- err - ',err);
          console.log('Del_Inspection - result - ',result);
          if (err) resolve(err)
          else resolve(result);
        }
    );
  });
}

function New_Elevator( request ){
  return new Promise ( function(resolve, reject) {
    pool.query(
      "INSERT INTO `elevators`.`elevator` VALUES ( DEFAULT,'"+ request.elevator_name + "',"+"DEFAULT,DEFAULT,DEFAULT,DEFAULT,DEFAULT,DEFAULT " + ")",
        function (err, result) {
          console.log('New_Elevator - err - ',err);
          console.log('New_Elevator - result - ',result);
          if (err) resolve(err)
          else resolve(result);
        }
    );

  });
}

function Update_Elevator( request ){
  return new Promise ( function(resolve, reject) {
    if ( request.parameter == 'simple' ) {
      pool.query("UPDATE `elevators`.`elevator` SET "+
      "`elevator_name` = '" +  request.elevator_name + "', " +
      "`adress` = '" +  request.adress + "', " +
      "`owner` = " + ( request.owner == null || request.owner == 0 ? "DEFAULT, " : "'" +  request.owner + "', " ) +
      //"`contact_person` = " + ( typeof( request.contact_person ) != Number ? "DEFAULT, " : "'" +  request.contact_person + "', " ) +
      "`comments` = '" +  request.comments + "' " +
      " WHERE (`id` = '" + request.id + "')",
        function (err, result) {
          console.log('simple Update_Elevator - err - ',err);
          console.log('simple Update_Elevator - result - ',result);
          if (err) resolve(err)
          else resolve(result);
        }
      );
    }

  });
}

function Del_Elevator( request ){
  return new Promise ( function(resolve, reject) {
    pool.query("DELETE FROM `elevators`.`elevator` WHERE (`id` = '"+ request.id + "')",
        function (err, result) {
          console.log('Del_Elevator - err - ',err);
          console.log('Del_Elevator - result - ',result);
          if (err) resolve(err)
          else resolve(result);
        }
    );

  });
}

function New_Firm( request ){
  return new Promise ( function(resolve, reject) {
    pool.query("INSERT INTO `elevators`.`firm` VALUES ( DEFAULT,'"+ request.name + "',"+"DEFAULT,DEFAULT,DEFAULT,DEFAULT " + ")",
        function (err, result) {
          console.log('New_Firm - err - ',err);
          console.log('New_Firm - result - ',result);
          if (err) resolve(err)
          else resolve(result);
        }
    );

  });
}

function Del_Firm( request ){
  return new Promise ( function(resolve, reject) {
    pool.query("DELETE FROM `elevators`.`firm` WHERE (`id` = '"+ request.id + "')",
        function (err, result) {
          console.log('Del_Firm - err - ',err);
          console.log('Del_Firm - result - ',result);
          if (err) resolve(err)
          else resolve(result);
        }
    );
  });
}

function Update_Firm( request ){
  return new Promise ( function(resolve, reject) {
    pool.query("UPDATE `elevators`.`firm` SET "+
      "`name` = '" +  request.name + "', " +
      "`type` = '" +  request.type + "', " +
      "`adress` = '" +  request.adress + "', " +
      "`contact_person` = " + ( typeof( request.contact_person ) != Number ? "DEFAULT, " : "'" +  request.contact_person + "', " ) +
      "`comments` = '" +  request.comments + "' " +
      " WHERE (`id` = '" + request.id + "')",
        function (err, result) {
          console.log('Update_Firm - err - ',err);
          console.log('Update_Firm - result - ',result);
          if (err) resolve(err)
          else resolve(result);
        }
      );
  });
}

function New_Person( request ){
  return new Promise ( function(resolve, reject) {
    pool.query("INSERT INTO `elevators`.`person` VALUES ( DEFAULT,'"+ 
      request.name + "', '"+
      request.surname + "',DEFAULT,DEFAULT,DEFAULT,DEFAULT,DEFAULT " + ")",
        function (err, result) {
          console.log('New_Person - err - ',err);
          console.log('New_Person - result - ',result);
          if (err) resolve(err)
          else resolve(result);
        }
    );

  });
}

function Del_Person( request ){
  return new Promise ( function(resolve, reject) {
    pool.query("DELETE FROM `elevators`.`person` WHERE (`id` = '"+ request.id + "')",
        function (err, result) {
          console.log('Del_Person - err - ',err);
          console.log('Del_Person - result - ',result);
          if (err) resolve(err)
          else resolve(result);
        }
    );
  });
}

function Update_Person( request ){
  return new Promise ( function(resolve, reject) {
      pool.query("UPDATE `elevators`.`person` SET "+
      "`name` = '" +  request.name + "', " +
      "`surname` = '" +  request.surname + "', " +
      "`firm` = '" +  request.firm + "', " +
      "`elevator` = '" +  request.elevator + "', " +
      "`position` = '" +  request.position + "', " +
      "`phone` = '" +  request.phone + "', " +
      "`comments` = '" +  request.comments + "' " +
      " WHERE (`id` = '" + request.id + "')",
        function (err, result) {
          console.log('Update_Person - err - ',err);
          console.log('Update_Person - result - ',result);
          if (err) resolve(err)
          else resolve(result);
        }
      );
  });
}

//----------------------------------------------------------

module.exports = app;