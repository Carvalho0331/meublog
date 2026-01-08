const mongoose = require("mongoose")
const express = require("express")
const rounter = express.Router()
require("../models/usuario")
const Usuario = mongoose.model("usuario")
const bycrypt = require("bcryptjs")
const passport = require("passport")





rounter.get("/registo", (req, res) => {
    res.render("usuario/registo")
})


rounter.post("/registo/feito", (req, res) => {







    Usuario.findOne({ email: req.body.email }).then((usuario) => {
        console.log(usuario)
        if (usuario) {
            req.flash("error_msg", "Houve um erro ao tentar")
            res.redirect("/usuario/registo")
        } else {

            const usuarioNovo = new Usuario ({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
            })
            bycrypt.genSalt(10, (erro, salt) => {
                bycrypt.hash(usuarioNovo.password, salt, (erro, hash) => {
                    if (erro) {
                        req.flash("error_msg", "houve um erro ao salvar usuario")
                        res.redirect("/")
                    }

                    usuarioNovo.password = hash

                    usuarioNovo.save().then(() => {
                        req.flash("success_msg", "Usuario Registado com sucesso")
                        res.redirect("/usuario/login")
                    }).catch(() => {
                        req.flash("error_msg", "Houve um erro ao criar usuario")
                        res.redirect("/")
                    })
                })
            })
        }



    })
})


rounter.get("/login", (req,res)=>{
    res.render("usuario/login")
})

rounter.post("/login", (req,res,next)=>{


    passport.authenticate("local", {
            successRedirect:"/",
            failureRedirect:"/usuario/login",
            failureFlash:true
        })(req,res,next)
})



module.exports = rounter