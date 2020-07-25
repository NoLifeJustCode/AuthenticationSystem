const User=require('../models/user');
const crypto=require('crypto')
const mailer=require('../config/nodemailerConfig')
const Token=require('../models/Token')
const bcrypt=require('bcrypt')
const email=require('../dev.json')
//const configKue=require('../config/configKue')
const senderMail=''
// controller to handle signup
module.exports.signUp=async(req,res)=>{
    try{ 
        let data={
            email:req.body.email,
            name:req.body.name,
            password:req.body.password
        }
        if(data.email==''||data.name==''||data.password=='')
            {   
               throw new Error('Invalid data');
            }
        let user=await User.create(data);
        // configKue.queue.create('email',{
        //     from:senderMail,
        //     to:user.email,
        //     subject:'Sign Up successful',
        //     text:`<h3>${user.name} has successfull signed up using this email<h3>`
        // });
        return res.redirect('/unAuth/Login');
    }catch(e){
        if(e.message=='Invalid data')
            req.flash('error',e.message);
        else
            req.flash('error', 'User email already exists')
        return res.redirect('back')
    }

}

module.exports.renderSignUp=async(req,res)=>{
    return res.render('signup');
}

module.exports.renderLogin=(req,res)=>{
    return res.render('login');
}
// generate auto expiring link
module.exports.forgotPassword=async(req,res)=>{
    
    try{
        // retreive mail to which link is to be generated
    let email=req.params.email||req.query.email||req.body.email;
    
    let user=await User.findOne({email});
    // check if user exist
    if(!user)
        throw new Error('User doesn\'t exit' );
    let token=await Token.create({user:user.id});
    user=await User.findByIdAndUpdate(user.id,{forgottenPasswordLink:token.id},{new :true});
   
    var mailOptions = {
        from: email.id,
        to: user.email,
        subject: 'Reset Password Link',
        text: `http://localhost:3000/unAuth/resetPassword/${user.forgottenPasswordLink}/${token.token}</br>Link expires in 1 minute`
      };
    mailer.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    return res.send('Reset link sent to registered email id');
    }catch(e){
        req.flash('error',e.message)
        return res.redirect('back')
    }
}
// render password reset view
module.exports.getResetPassword=async(req,res)=>{
    try{
    // handle when user already logged in
    if(req.user){
        return res.render('resetPassword',{link:'/Auth/updatePassword','old-password':true})
    }
    
    
    let token=await Token.findById(req.params.id); 
    // validate token Authenticity 
    if(token&&(token.token==req.params.token)||req.user){
        return res.render('resetPassword',{link:`/unAuth/updatePassword/${token.id}`,'old-password':false});
    }else{
        throw new Error('Token expired')
    }
    }catch(e){
        req.flash('error',e.message)
        return res.redirect('/unAuth/Login');
    }
    
}

module.exports.updatePassword=async(req,res)=>{
    try{
        
        
        let id=req.user&&req.user.id;
        let link=false;
        // check if user already logged in 
        if(!id){
            // get user id from token
            id=await Token.findById(
                req.params.id
            )
        
            id=id.user;
            link=true;// for link based reset
        }
        //when token has expired or link is invalid
        if(!id){
            throw new Error('Invalid link');
        }

        user=await User.findById(id);
        // handle when logged in
        if(!link&&!await user.verifyPassword(req.body.password))
        {
            throw new Error('Invalid old password')
        }
        // update password
        user=await User.findOneAndUpdate({_id:id},{password:req.body['new-password']},{new:true});
        // set flash
        req.flash('success','Password update successfull');
        // remove token to avoid reuse
        Token.findByIdAndRemove(user.forgottenPasswordLink,(err,doc)=>{
            console.log(err)
        });
        // logout to signin again
        req.logOut()
        return res.redirect('/unAuth/login');
    }catch(e){
        req.flash('error',e.message)
        return res.redirect('/unAuth/login')
    }
}

module.exports.logout=(req,res)=>{
    req.logOut();
    return res.redirect('/unAuth/login');
}
module.exports.home=(req,res)=>res.render('home')