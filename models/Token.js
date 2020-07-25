const mongoose =require('mongoose');
const crypto=require('crypto')
/**
 * token collection to store auto expiring tokens
 */
const tokenSchema=new mongoose.Schema({
    token:{
        type:String,
        default:crypto.randomBytes(16).toString('hex')
    },
    expiresAt:{
        type:Date,
        default:Date.now()+3600,
        expires:60,
    },
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User'
    }
},{timestamps:true})

const model=mongoose.model('Token',tokenSchema)
// model.collection.dropIndex({'expiresAt':1},async function(err){
//      console.log(await model.listIndexes())
//  })


 module.exports=model