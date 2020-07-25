const Router=require('express').Router();
const passport=require('passport');
const AuthController=require('../../controllers/AuthenticateController');
// get signup page
Router.get('/signUp',AuthController.renderSignUp);
//login view
Router.get('/Login',AuthController.renderLogin);
//signup handler
Router.post('/signUp',AuthController.signUp);
//login handler
Router.post('/login',passport.authenticate('UserAuth',{
    successRedirect:'/Auth/',
    successFlash:'Login SuccessFull',
    failureRedirect:'back',
    failureFlash:'Invalid credentials'

}))
// reset password when not logged using link
Router.get('/resetPassword/:id/:token',AuthController.getResetPassword)
// generate link to reset password 
Router.get('/forgot-password/',AuthController.forgotPassword);
//update password using link
Router.post('/updatePassword/:id',AuthController.updatePassword);
module.exports=Router;