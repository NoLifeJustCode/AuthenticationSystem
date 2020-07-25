const passport =require('passport')
const LocalStratergy=require('passport-local').Strategy;

function getPassport(){
    return passport;
}

function setupLocalStratergy(getUser,retreiveUser,passport=passport,StratergyName="Local",usernameField="username",passwordField="password"){
    passport.use(StratergyName,new LocalStratergy({
        usernameField,
        passwordField
    },
    async( username ,password,done)=>{
        try{
            let user=await getUser(username,password);
            if(user)
                done(null,user);
            else 
                done(null,false);
        }catch(e){
            done(e,null);
        }
    }

    ));

    passport.serializeUser((user,done)=>{
        
        //console.log('serializing');
        done(null,user.id)
    })

    passport.deserializeUser(async(userId,done)=>{
      //  console.log('des')
        try{
            let user=await retreiveUser(userId);
            done(null,user);
        }catch(e){
            done(e,null);
        }
    })
}

module.exports.getPassport=getPassport;
module.exports.setupLocalStratergy=setupLocalStratergy;