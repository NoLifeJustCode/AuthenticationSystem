const dev=require('./dev.json')
const express=require('express');
const app=express();
const dbhost='mongodb://localhost:27017/AuthenticationSystem'
const passportConfig=require('./config/passportConfig')
const express_flash=require('express-flash')
const express_session=require('express-session')
const passport=passportConfig.getPassport();
const mongoose=require('./config/mongooseConfig').configureMongoose(dev.dbhost)
const User=require('./models/user')
// get local passport config 
passportConfig.setupLocalStratergy(getUser,retreiveUser,passport,'UserAuth','email');
// static files middleware
app.use('/assets',express.static('./assets'));
// parse form data
app.use(express.urlencoded());
// setup session
app.use(express_session({
    secret:'secret',
    saveUninitialized:false,
    resave:false
}))
// flash to setup flash message
app.use(express_flash())
// init passport
app.use(passport.initialize())
// run passport session middlware
app.use(passport.session())
// set view and vieww engine
app.set('view engine','ejs');
app.set('views' ,'./views');
// route to index 
app.use('/',require('./routes/index'))

app.listen(3000,function(req,res){
  
    console.log('server running');
})

/**
 * retrieve a user document and verify authenticity
 * @param {*} email 
 * @param {*} password 
 */
async function getUser(email,password){
    try{
       
        let user=await User.findOne({
            email
        });

        if(user&&await user.verifyPassword(password))
            {
                return user;
            }
        return false
    }catch(e){
       
        throw e;   
    }
}
/**
 * retreive user document
 * @param {*} id 
 */
async function retreiveUser(id){
    let user=await User.findById(id);
    return user;
}