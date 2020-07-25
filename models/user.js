const mongoose =require('mongoose');
const bcyrpt=require('bcrypt');
/**
 * user collections 
 * email is unique
 */
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    }
    ,
    password:{
        type:String,
        required:true
    },
    forgottenPasswordLink:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Token',
    }
    
},{timestamps:true});

//hash password
userSchema.pre('save',async function(next){
    
    const salt_rounds=10//Default salt_rounds
    console.log(this)
    console.log(this.password)
    this.password=await bcyrpt.hash(this.password,salt_rounds)
    next()
})
//validate email and mobile
userSchema.path('email').validate(function(email){
    var emailRegex=/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    return emailRegex.test(email)
},'email validation failed')

//Instance methods to verify hashed passwords
userSchema.methods.verifyPassword= async function(password){
    console.log(await bcyrpt.compare(password,this.password));
    return await bcyrpt.compare(password,this.password)
}
/**
 * to hash password on reset
 */
userSchema.pre('findOneAndUpdate',async function(next){
    try{
        if(this._update.password){
            const password=await bcyrpt.hash(this._update.password,10);
            this._update.password=password;
        }
        next();
    }catch(e){
        next(e)
    }
})
module.exports=mongoose.model('User',userSchema);