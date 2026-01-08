const express = require("express")
const mongoose = require("mongoose")
const flash =  require("connect-flash")
const bodyParser = require("body-parser")
const session = require("express-session")
const handlebars = require("express-handlebars")
const app = express()
const admin =  require("./routes/admin")
const usuario =  require("./routes/usuario")
const path = require("path")
require("./models/postagens")
const Postagens = mongoose.model("Postagens")
require("./models/categorias")
const Categorias = mongoose.model("Categorias")
require("./models/usuario")
const User = mongoose.model("usuario")
const passport = require("passport")
require("./config/auth")(passport)




// configuracoes

app.use(session({
    secret:"carvalho@02",
    resave:true,
    saveUninitialized:true,
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    next()
})

app.engine("handlebars", handlebars.engine({defaultLayout:"main"}))
app.set("view engine", "handlebars")


app.use(express.static(path.join(__dirname,"./public")))

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

mongoose.connect("mongodb+srv://salimo_carvalho:salimo_carvalho@cluster0.lokg7eq.mongodb.net/").then(()=>{
    console.log("Banco de dados conectado com sucesso")
}).catch(()=>{
    console.log("Houve um erro ao tentar se conectar ao Banco")
})



app.get("/", (req,res)=>{

    Postagens.find().populate("categoria").lean().then((postagem)=>{
        Categorias.find().lean().then((categoria)=>{
            
            req.flash("success_msg", "Postagens carregadas com successo")
            res.render("index", {postagem:postagem, categoria:categoria})
        }).catch(()=>{})

    }).catch(()=>{})



})

app.use("/admin", admin)
app.use("/usuario", usuario)



app.post("/postagens/ler/:id",(req,res)=>{

Postagens.findOne({_id:req.params.id}).lean().then((postagem)=>{
    req.flash("success_msg", "Pagina de noticia carregada")
    res.render("postagens/lerpostagens", {postagem:postagem})
    
}).catch(()=>{
    req.flash("error_msg", "Nao foi possivel carregar a pagina")
})

})


app.get("/categorias/postagens/:slug",(req,res)=>{
    
    Categorias.findOne({slug:req.params.slug}).lean().then((categoria)=>{
        
        if(categoria){
            Postagens.find({categoria:categoria._id}).populate("categoria").lean().then((postagem)=>{
                console.log(postagem)
                res.render("postagens/verpostagens",{postagem:postagem,categoria:categoria})
            })

        }
        
    })

    



})








const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log("Servidor Rodando")

})
