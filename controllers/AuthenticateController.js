const User=require('../models/user');
const crypto=require('crypto')
const mailer=require('../config/nodemailerConfig')
const Token=require('../models/Token')
const bcrypt=require('bcrypt')
const email=require('../dev.json').email
//console.log(email)
const fetch=require('node-fetch')
//const configKue=require('../config/configKue')
const senderMail=''
const Recaptcha=require('express-recaptcha').RecaptchaV3
const {sitekey,secretkey}=require('../dev.json').recaptcha;

const recpatch=new Recaptcha(sitekey,secretkey)
// controller to handle signup
async function validateCaptcha(captcha){
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${captcha}`
    return await fetch(url,{method:'POST'}).then(response=>response.json()).then(json=>{
       // console.log(json)
        return json.success&&json.score>0.6;
    }).catch(e=>{
        req.flash("error",e.message)
        return false;
    })
}
module.exports.signUp=async(req,res)=>{
    try{ 
        let captcha=req.body.captcha
        let j=await validateCaptcha(captcha)
        if(!j)
        throw new Error('Captcha Validation failed')
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
        req.flash('success',"login success")
        return res.redirect('/unAuth/Login');
    }catch(e){
        //console.log(e.message)
        if(e.message=='Invalid data'||e.message=='Captcha Validation failed')
            req.flash('error',e.message);
        else
            req.flash('error', 'User email already exists')
        return res.redirect('back')
    }

}
module.exports.LoginMiddleware=async(req,res,next)=>{
   // console.log(req.body)
    if(!await validateCaptcha(req.body.captcha)){
        req.flash('error','captcha validation failed')
        return res.redirect('back')
    }
    next();
}
module.exports.renderSignUp=async(req,res)=>{
    return res.render('signup',{sitekey:sitekey});
}

module.exports.renderLogin=(req,res)=>{
    return res.render('login',{sitekey:sitekey});
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
    if(await Token.findById(user.forgottenPasswordLink))
        {
            return res.send('Reset Link already sent')
        }
    let token=await Token.create({user:user.id});
    user=await User.findByIdAndUpdate(user.id,{forgottenPasswordLink:token.id},{new :true});
   
    var mailOptions = {
        from: email.id,
        to: user.email,
        subject: 'Reset Password Link',
        text: `http://localhost:3000/unAuth/resetPassword/${user.forgottenPasswordLink}/${token.token}\nLink expires in 1 minute`
      };
    mailer.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error.message);
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
            if(err)
                 console.log(err.message)

        });
        // logout to signin again
        req.flash("success","password updated please relogin")
        req.logOut()
        return res.redirect('/unAuth/login');
    }catch(e){
       // console.log(e)
        req.flash('error',e.message)
        return res.redirect('/unAuth/login')
    }
}

module.exports.logout=(req,res)=>{
    req.logOut();
    return res.redirect('/unAuth/login');
}
module.exports.home=(req,res)=>res.render('home')