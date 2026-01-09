const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")

require("../models/usuario")
const Usuario = mongoose.model("usuario")



module.exports = function(passport){
    passport.use(new localStrategy({usernameField:"email", passwordField:"password"}, (email,senha,done)=>{
        Usuario.findOne({email}).then((usuario)=>{
            if(!usuario){
                return done(null,false,{message:"essa conta nao existe"})
            }
            bcryptjs.compare(senha, usuario.password, (erro,batem)=>{
              if(!batem){
                  return done(null, usuario)
                }else{
                  return done(null,false,{message:"senha incorrecta"})
                }
            })
        })
    }))



passport.serializeUser(function(usuario, done){
    done(null, usuario.id);
});

passport.deserializeUser((id, done) => {
    Usuario.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err))

     
    
})



}