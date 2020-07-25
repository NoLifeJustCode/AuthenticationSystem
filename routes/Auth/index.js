const Router=require('express').Router();
const mailer=require('../../config/nodemailerConfig');
const AuthController=require('../../controllers/AuthenticateController')
// routes to reset password when logged in
Router.get('/resetPassword',AuthController.getResetPassword)
// route to updating password on logged in
Router.post('/updatePassword',AuthController.updatePassword)
//home page
Router.get('/',AuthController.home)

Router.get('/logout',AuthController.logout)
module.exports=Router;