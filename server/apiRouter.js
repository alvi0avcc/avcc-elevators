//apiRouter.js
 
 
const express =require('express');
const apiRouter = express.Router();
 
 const jsonwebtoken = require('jsonwebtoken');
const db = require('./db');
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const cookieParser = require('cookie-parser');
 
const userRouter = require('./user');
 
 
apiRouter.use(cookieParser());


apiRouter.get('/', (req, res)=>{
    const { userId } = req.session
    console.log(userId);
    res.send(`
    <h1> Welcome!</h1>
    <a href = 'http://avcc.sytes.net/'> AVCC </a>
    `);
  });

apiRouter.post('/register', async (req, res, next)=>{
    try{
        const userName = req.body.userName;
        const email = req.body.email;
        let password = req.body.password;
        console.log('register request = ', req.body);
        console.log('userName = ', userName);
  
              if (!userName || !email || !password) {
                return res.sendStatus(400);
             }
  
             const salt = genSaltSync(10);
             password = hashSync(password, salt);
  
               
  
        const user =  await db.insertUser(userName, email, password);
         
        const jsontoken = jsonwebtoken.sign({user: user}, process.env.SECRET_KEY, { expiresIn: '30m'} );
        res.cookie('token', jsontoken, { httpOnly: true, secure: true, SameSite: 'strict' , expires: new Date(Number(new Date()) + 30*60*1000) }); //we add secure: true, when using https.
 
 
        res.json({token: jsontoken});
 
            //return res.redirect('/mainpage');
  
    } catch(e){    
        console.log(e);
        res.sendStatus(400);
    }
});
 
 
 
 
 apiRouter.post('/login', async(req, res, next)=>{
    try{
    const email = req.body.email;
    const password = req.body.password;
    user = await db.getUserByEmail(email);
     
    if(!user){
        return res.json({
            message: "Invalid email or password"
        })
    }
 
    const isValidPassword = compareSync(password, user.password);
    if(isValidPassword){
        user.password = undefined;
        const jsontoken = jsonwebtoken.sign({user: user}, process.env.SECRET_KEY, { expiresIn: '30m'} );
        res.cookie('token', jsontoken, { httpOnly: true, secure: true, SameSite: 'strict' , expires: new Date(Number(new Date()) + 30*60*1000) }); //we add secure: true, when using https.
 
        res.json({token: jsontoken});
       //return res.redirect('/mainpage') ;
 
    }  else{
        return res.json({
            message: "Invalid email or password"
        });
    } 
 
    } catch(e){
        console.log(e);
    }
});
 
//----------create table
apiRouter.post('/usertable', async(req, res, next)=>{
    try{
    user = await db.createUserTable();
    console.log('user = ',user);
    if(!user){
        return res.json({
            message: "Error create user table"
        })
    } else return res.json({
        message: user
    })
 
    } catch(e){
        console.log(e);
    }
});
//---------- fin create table
 
 
 
 
 
 
    
  
//  Verify Token
async function  verifyToken  (req, res, next){
    
   const token=req.cookies.token;
    console.log(token);
     
    if(token === undefined  ){
         
            return res.json({
                message: "Access Denied! Unauthorized User"
              });
    } else{
 
        jsonwebtoken.verify(token, process.env.SECRET_KEY, (err, authData)=>{
            if(err){
                res.json({
                    message: "Invalid Token..."
                  });
 
            } else{
                
               console.log(authData.user.role);
               const role = authData.user.role;
               if(role === "admin"){
 
                next();
               } else{
                   return res.json({
                       message: "Access Denied! you are not an Admin"
                     });
 
               }
            }
        })
    } 
}
 
 
 
 
 
   apiRouter.use('/user', verifyToken, userRouter);
 
 
    
module.exports = apiRouter;