require("dotenv").config();
const port= process.env.PORT || 3001;
const host = process.env.HOST || '127.0.0.1';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const morgan = require('morgan');

const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const apiRouter = require('./apiRouter');

const session = require('express-session');
/*
const redis = require('redis');
const redisStore = require('connect-redis').default;
const redisClient = redis.createClient();
const RedisStore = new redisStore({
  host: host,
  port: 6379,
  client: redisClient
});

//const client = Redis.createClient();
redisClient.connect().catch(console.error);

redisClient.on('error', function (err) {
  console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
  console.log('Connected to redis successfully');
});
*/

const mysql = require('mysql');
//const SQLiteStore = require('connect-sqlite3')(session);
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.MYSQL_DB
});
/*
connection.connect(function(err) {
  if (err) throw err;
  console.log("MySQL DB - Connected!");
});
*/

// Attempt to catch disconnects 
connection.on('connection', function (stream) {
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

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(morgan('dev'));// we  use morgan with the pre-defined format "dev" for developer.
 
app.use(bodyParser.json()); // for parsing application/json

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cookieParser('secret key'));
apiRouter.use(cookieParser());
app.use('/apiRouter',apiRouter)

//----------------------------------------------------------------------------auth

function checkAuth( req ) {
  console.log('checkAuth user= ',req.user);
  console.log('checkAuth user Authenticated= ',req.isAuthenticated());
  console.log('checkAuth message= ',req.message);
  console.log('checkAuth cookies= ',req.cookies);
  console.log('checkAuth sessionID= ',req.sessionID);
  console.log('checkAuth sessionStore= ',req.sessionStore.sessions);
  if ( req.isAuthenticated() ) return true
    else return false;
};

passport.serializeUser((user, done) => {
  console.log('serializeUser user = ',user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('de serializeUser user = ',user);
  done(null, user)
});




app.use(session({
  cookie: { maxAge: 3600000 },
  rolling: true,
  secret: "secret key",
  resave: false,
  saveUninitialized: true,
  //store: RedisStore
}));

app.use(flash());
app.use(passport.session());
app.use(passport.initialize());

passport.use( 'local',
  new localStrategy( { usernameField: 'login', passwordField: 'password' },
  ( login, password, done ) => {
    SignIn( login, password ).then(function(result){ 
      console.log("SignIn response:", result);
      //response.json( result ) ;
      if ( result.username && result.password == 'ok' && result.enabled == 1 ) return done(null, result, { message: 'SignIn' } )
      else return done(null, false, { message: 'Wrong user/password' } );
    }) ;
  })
);

app.get('/', (req, res) => {
  res.json( { online: 'true' } );
});

/*
app.get('/login', checkAuth(), (req, res) => {
  res.send('Login page. Please, authorize.');
});
*/
app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
      console.log('loginned = ', req.user);
      res.send(req.user);
  } else {
      res.send('loginned = null');
  }
});

app.get('/session', (req, res) => {
  if (req.isAuthenticated()) {
      res.send(req.session);
  } else {
      res.send('session = null');
  }
});

app.get('/logout', (req, res, next) =>{
  req.logout((err) => {
    if (err) { return next(err); }
    res.send({ login: 'logout' });
    console.log('auth out= ', req.user);
  });
});

app.post('/login',
  passport.authenticate('local', {
      session: true,
      successRedirect: '/login',
      failureRedirect: '/fail',
      failureFlash: true,
  })
);

//----------------------------------------------------------------------------auth




app.get('/', (req, res) => {
  res.json( { online: 'true' } );
});


app.get("/connect", (request, response) => {
  //console.log(request.body);
  response.send( 'empty' );
});

/*
app.post("/connect", (request, response) => {
  console.log('connect: ',request.body);
  SignIn( request.body ).then(function(result){ console.log("SignIn response:", result); response.json( result ) });
});
*/
app.post("/inspectioninfo", (request, response) => {
  const { user } = request.session.passport || {};
  console.log('Inspection session: ',request.session);
  console.log('Inspection info: ',request.body);
  console.log('Inspection info user : ',user);
  if ( request.isAuthenticated ) {
    console.log('isAuthenticated : ok');
/*    
     if ( user.inspection_read == 1 ) 
      Inspection_List( request.body ).then(function(result){ console.log("Inspection_List response:", result); response.json( { result: result, error: null } ) })
      else response.json( { result: null, error: 'You don`t have permission for read.' } );
*/
  }
});

app.post("/inspectiondata", (request, response) => {
  console.log('Inspection data: ',request.body);
  if ( request.isAuthenticated )
    Inspection_Data( request.body ).then(function(result){ console.log("Inpection_Data response:", result); response.json( result ) });
});

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

/*
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
*/
app.listen(port, host, function () {
  console.log(`Server listens http://${host}:${port}`);
});

//----------------------------------------------------------

const user =  
  {
    username: 'user',
    password: 'user',
    name: 'Test',
    surname: 'User',
  };

//----------------------------------------------------------

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


function Inspection_List( request ){
  return new Promise ( function(resolve, reject) {
    connection.query(
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

function Inspection_Data( request ){
  return new Promise ( function(resolve, reject) {
    connection.query(
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

function Elevator_List( request ){
  return new Promise ( function(resolve, reject) {

    let filter = 'all';
    if ( request.filter ) filter = request.filter;

    let sorted = 'id';
    if ( request.sorted ) sorted = request.sorted;

    let id = '0';
    if ( request.id ) id = request.id;

    console.log('Elevator_List filter = ',request);

    if ( filter == 'all' )
    connection.query("SELECT e.id, e.elevator_name, e.adress, e.owner, e.complex, e.silo, e.warehouse, e.comments, f.name FROM `elevators`.`elevator` AS e LEFT JOIN `elevators`.`firm` AS f ON e.owner = f.id ORDER by " + sorted, function (err, result) {
      if (err) resolve(err);
      console.log(result);
      resolve(result);
    });

    if ( filter == 'owner' )
    connection.query("SELECT e.id, e.elevator_name, e.adress, e.owner, e.complex, e.silo, e.warehouse, e.comments, f.name FROM `elevators`.`elevator` AS e LEFT JOIN `elevators`.`firm` AS f ON e.owner = f.id WHERE e.owner = " + id + " ORDER by " + sorted, function (err, result) {
      if (err) resolve(err);
      console.log(result);
      resolve(result);
    });

  })
};

function Elevator_Data( request ){
  console.log(request);

  return new Promise ( function(resolve, reject) {
    connection.query("SELECT * FROM `elevators`.`elevator` WHERE id = " + request.id, function (err, result) {
      if (err) resolve(err);

      console.log(result);
      resolve(result);
    })
  })
};

function Import_Complex( request ){
  return new Promise ( function(resolve, reject) {
    connection.query("UPDATE `elevators`.`elevator` SET `complex` = '" + request.data + "' WHERE id = " + request.id, function (err, result) {

      if (err) resolve(err);

      console.log(result);
      resolve(result);
    })
  })
};

function Import_Silo( request ){
  return new Promise ( function(resolve, reject) {
    connection.query("UPDATE `elevators`.`elevator` SET `silo` = '" + request.data + "' WHERE id = " + request.id, function (err, result) {

      if (err) resolve(err);

      console.log(result);
      resolve(result);
    })
  })
};

function Import_Warehouse( request ){
  return new Promise ( function(resolve, reject) {
    connection.query("UPDATE `elevators`.`elevator` SET `warehouse` = '" + request.data + "' WHERE id = " + request.id, function (err, result) {

      if (err) resolve(err);

      console.log(result);
      resolve(result);
    })
  })
};

function Firm_List( request ){
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
        connection.query("SELECT * FROM `elevators`.`firm` ORDER BY " + sorted, function (err, result) {
          if (err) resolve(err);
          console.log(result);
          resolve(result);
        });

    if ( list == 'contact') 
      connection.query("SELECT f.id, p.firm, p.elevator, e.elevator_name, p.name, p.surname, p.position, p.phone, p.comments FROM `elevators`.`firm` AS f LEFT JOIN `elevators`.`person` AS p ON f.id = p.firm LEFT JOIN `elevators`.`elevator` AS e ON e.id = p.elevator WHERE f.id = " + id + " ORDER BY e.elevator_name", function (err, result) {
        if (err) resolve(err);
        console.log(result);
        resolve(result);
      });

    if ( request.filter == 'id' ) 
      connection.query("SELECT * FROM `elevators`.`firm` WHERE id = '" + request.id + "'", function (err, result) {
        if (err) resolve(err);
        console.log(result);
        resolve(result);
      });
  })
};

function Firm_Data( request ){
  console.log(request);
  return new Promise ( function(resolve, reject) {
    connection.query("SELECT * FROM `elevators`.`firm` WHERE id = " + request.id, function (err, result) {
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
      connection.query("SELECT p.id, p.name, p.surname, p.firm, p.elevator, p.position, p.phone, p.comments, f.name AS firm_name, e.elevator_name FROM `elevators`.`person` AS p LEFT JOIN `elevators`.`firm` AS f ON p.firm = f.id LEFT JOIN `elevators`.`elevator` AS e ON p.elevator = e.id ORDER BY " + sort, function (err, result) {
        if (err) resolve(err);
        console.log(result);
        resolve(result);
      });

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
  })
};

function Person_Data( request ){
  console.log(request);
  return new Promise ( function(resolve, reject) {
    connection.query("SELECT * FROM `elevators`.`person` WHERE id = " + request.id, function (err, result) {
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
      connection.query("SELECT u.*, p.name, p.surname FROM `elevators`.`users` AS u LEFT JOIN `elevators`.`person` AS p ON u.person_id = p.id ORDER BY " + sort, function (err, result) {
        if (err) resolve(err);
        console.log(result);
        resolve(result);
      });

function User_Data( request ){
  console.log(request);
  return new Promise ( function(resolve, reject) {
    connection.query("SELECT * FROM `elevators`.`users` WHERE id = " + request.id, function (err, result) {
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
    connection.query("INSERT INTO `elevators`.`inspection` (`order_no`, `order_date`)" +
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
      connection.query("UPDATE `elevators`.`inspection` SET "+
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
    connection.query("DELETE FROM `elevators`.`inspection` WHERE (`id` = '"+ request.id + "')",
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
    connection.query(
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
      connection.query("UPDATE `elevators`.`elevator` SET "+
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
    connection.query("DELETE FROM `elevators`.`elevator` WHERE (`id` = '"+ request.id + "')",
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
    connection.query("INSERT INTO `elevators`.`firm` VALUES ( DEFAULT,'"+ request.name + "',"+"DEFAULT,DEFAULT,DEFAULT,DEFAULT " + ")",
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
    connection.query("DELETE FROM `elevators`.`firm` WHERE (`id` = '"+ request.id + "')",
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
      connection.query("UPDATE `elevators`.`firm` SET "+
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
    connection.query("INSERT INTO `elevators`.`person` VALUES ( DEFAULT,'"+ 
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
    connection.query("DELETE FROM `elevators`.`person` WHERE (`id` = '"+ request.id + "')",
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
      connection.query("UPDATE `elevators`.`person` SET "+
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

function Connect( request ){
  let response = {
      message: 'user not found',
      connected: false
    };

  console.log(' request = ',request.body.username,'pass = ***');



  if ( request.body.username == user.username && request.body.password == user.password ) {
      response = {
         message: "User found",
         ip: request.ip,
         hostname: request.hostname,
         name: user.name,
         surname: user.surname,
         level: 'test-user',
         connected: true
        }
    };

  console.log(' response = ',response);

  return ( response )
}

module.exports = app;