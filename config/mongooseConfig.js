const mongoose=require('mongoose');
/**
 * send a instance of configured mongoose 
 * 
 * @param {*} host : the db to connect to can be used to configure dev,production,test host
 */
function configureMongoose(host){
    mongoose.connect(host,{useNewUrlParser:true,useUnifiedTopology:true});
    const db=mongoose.connection;

    db.once('connect',()=>console.log('connection to mongodb successfull'));

    db.on('error',(e)=> console.error.bind(console,'Error connecting to db'));
    return db;
}

module.exports.configureMongoose=configureMongoose;