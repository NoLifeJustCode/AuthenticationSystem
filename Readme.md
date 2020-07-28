/*
 * Setup and Execution
 */

 1.make sure 'pwd' is project directory
 2.use 'npm install' to install all dependencies needed for the project to execute without errors
 3.use 'npm start' to start the server 

 /*
  *  Project Directory and Structure
  */
  1.models
        contains all the model Schema connected to AuthenticationSystem Database
        Schemas contained:
           User Schema: contains User related info
           Token :contains auto expiring token


  2. Controllers:
         contains Controller required to router endpoint to respective actions
         Controllers:
                AuthController:
                    this has functions to support 
                    1.rendering and validating login and signup
                    2.handle reset-password,forgot password,logout,update password
  3.Routes:
         contains Routes need to route endpoints to respective actions
            Authorize:
                All routes with Authorize are Authenticated to provide acess to routes
            UnAuthenticated
                UnAuthenticated Routes are passed to this route
  4.config:
        contains configuration files to setup the basic properties need for use
        passportConfig:
            Configs a passport with a localStratergry binding checkUser,retreive user and authentication fields
        mongooseConfig:
            a function returing a db connection to specified host
        nodemailer:
            sets up the smtp config
        configKue:
            set up the kue for parellel jobs
        
 5. assets:
        contains all the static files
 
 6.dev.json:
        contains all the configuration properties to bind on runtime
        email{
            id,password
        }
        recapthcha {
            sitekey,secretkey
        }
        dbHost:databse host
        port:port to bind the server
/*
 *  Endpoints and responses
 */

 1.signup:
    URL:
        localhost:port/unAuth/signup
    Method:
        GET
    params:
        NA
    Validation:
        isLogged in
    Response:
        Render signup page if not logged in
        else redirect to login
    
2.signup:
    URL:
        localhost:port/unAuth/signup
    Method:
        POST
    params:
        email
        password
        name
    Validation:
        email and password validation and Authentication
        uniquness of email
    Response:
        redirect to login on success or respond with Invalid data
3.login:
    URL:
        localhost:port/unAuth/login
    Method:
        POST
    params:
        email
        password
        
    Validation:
        email and password validation and Authentication
        
    Response:
        redirect to home on success or respond with Invalid credentials
4.login:
    URL:
        localhost:port/unAuth/login
    Method:
        GET
    params:
       NA
    Validation:
      NA
    Response:
        render signin page
5.Reset password:
    URL:
        localhost:port/Auth/resetPassword
    Method:
        GET
    params:
        NA
    Validation:
        check session and Authentication
    Response:
        render password reset page
6.Update password:
    URL:
        localhost:port/Auth/updatePassword
    Method:
        POST
    params:
        old-password,new password
    Validation:
        check session and Authentication and verify old password
    Response:
        return success
7.Reset password:
    URL:
        localhost:port/unAuth/resetPassword/:id/:token
    Method:
        GET
    params:
        NA
    Validation:
        check token validatity 
    Response:
        render password reset page
8.forgot password:
    URL:
        localhost:port/unAuth/forgot-password
    Method:
        POST
    params:
        email
    Validation:
        check user registeration
    Response:
        send a password reset link
9.update password:
    URL:
        localhost:port/unAuth//updatePassword/:id
    Method:
        POST
    params:
        new password
    Validation:
        validate token 
    Response:
        confirmation

10.logout
    URL:
        localhost:port/Auth/logout
    Method:
        GET
    params:
        NA
    Validation:
        Authentication
    Response:
        redirect to login

    