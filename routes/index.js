const Router=require('express').Router();

// route when not logged in
Router.use('/unAuth',checkAuthorize,require('./unAuth/index'));
// route when logged in
Router.use('/Auth',checkAuthenticated,require('./Auth/index'));

Router.get('/',(req,res)=>res.redirect('/unAuth/Login'))
//Accessorty function for conditional routing
function checkAuthenticated(req,res,next){
    if(req.isAuthenticated())
        next()
    else
        res.redirect('/unAuth/login')
}

function checkAuthorize(req,res,next){
if(req.isAuthenticated())
    return res.redirect('/Auth/')
next()
}
module.exports=Router;