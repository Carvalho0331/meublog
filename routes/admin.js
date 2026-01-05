const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/postagens")
const Postagens = mongoose.model("Postagens")
require("../models/categorias")
const Categorias = mongoose.model("Categorias")


router.get("/", (req, res) => {
    res.render("admin/index")
})

router.get("/categorias", (req, res) => {




    Categorias.find().lean().sort({ data: "desc" }).then((categorias) => {
        req.flash("success_msg", "As categorias foram listadas com sucesso")
        res.render("admin/categorias", { categorias: categorias })
    }).catch(() => {
        req.flash("error_msg", "Houve um erro ao tentar adicionar a categoria")
        res.redirect("/admin/categorias")
    })
})

router.get("/categorias/add", (req, res) => {
    res.render("admin/addcategorias")
})
router.post("/categorias/nova", (req, res) => {
    const novasCategorias = {
        nome: req.body.nome,
        slug: req.body.slug,
    }

    new Categorias(novasCategorias).save().then(() => {
        req.flash("success_msg", "Categoria adicionada com sucesso")
        res.redirect("/admin/categorias")
    }).catch(() => {
        req.flash("success_msg", "Houve um erro ao adicionar Categoria")
        res.render("admin")
    })


})

router.get("/categorias/edit/:id", (req, res) => {
    Categorias.findOne({ _id: req.params.id }).lean().then((categoria) => {
        res.render("admin/editcategorias", { categoria: categoria })
    }).catch(() => {
        req.flash("error_msg", "Categoiras nao existe na lista")
        res.redirect("admin/editcategorias")
    })
})

router.post("/categorias/edit", (req, res) => {
    Categorias.findOne({ _id: req.body.id }).then((categoria) => {

        categoria.nome = req.body.nome
        categoria.slug = req.body.slug


        categoria.save().then(() => {
            req.flash("success_msg", "Os dados foram editados com sucesso")
            res.redirect("/admin/categorias")
        }).catch(() => {
            req.flash("error_msg", "Houve um erro ao tentar editar a categoria")
            res.redirect("/admin/categoria")
        })

    }).catch(() => {
        req.flash("error_msg", "Houve um erro tecnico ao tentar renderizar os dados")
        res.redirect("/admin/categorias")
    })
})



router.post("/categorias/deletar", (req, res) => {
    Categorias.deleteOne({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Categoria delectada com sucesso")
        res.redirect("/admin/categorias")
    }).catch(() => {
        req.flash("error_msg", "houve um erro ao tentar delectar a categorias")
        res.redirect("/admin/categorias")
    })
})





router.get("/postagens", (req, res) => {

    Postagens.find().lean().populate("categoria").lean().then((postagem) => {
        req.flash("success_msg", "Postagens listadas ")
        res.render("admin/postagens", { postagem: postagem })

    }).catch(() => {
        req.flash("error_msg", "Houve um erro ao adicionar novas postagens")
        res.redirect("/admin")
    })
})
router.get("/postagens/add", (req, res) => {




    Categorias.find().lean().then((categoria) => {
        req.flash("success_msg", "As postagens foram listadas com sucesso")
        res.render("admin/addpostagens", { categoria: categoria })
    }).catch(() => {
        req.flash("error_msg", "Houve um erro ao tentar lista postagens")
        res.render("admin/addpostagens")

    })


})
router.post("/postagens/nova", (req, res) => {

    console.log(req.body.categoria)
    const novasPostagens = {
        titulo: req.body.titulo,
        slug: req.body.slug,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        categoria: req.body.categoria,
    }

    new Postagens(novasPostagens).save().then(() => {
        req.flash("success_msg", "Foi adicionado uma nova Postagem com successo")
        res.redirect("/admin/postagens")
    }).catch(() => {
        req.flash("error_msg", "Houve um erro ao Salvar a Postagem")
    })
})


router.get("/postagens/edit/:id", (req, res) => {
    Postagens.findOne({ _id: req.params.id }).lean().then((postagem) => {
        Categorias.find().lean().then((categoria) => {
            req.flash("success_msg", "Postagem carregada para edicao")
            res.render('admin/editpostagens', { postagem: postagem, categoria: categoria })

        }).catch(() => {
            req.flash("error_msg", "Houve um erro ao carregar as categorias")
            res.redirect("/admin/postagens")
        })


    }).catch(() => {
        req.flash("success_msg", "Houve um erro ao carregar as Postagens")
        res.redirect("/admin/postagens")

    })
})

router.post("/postagens/edit",(req,res)=>{
    Postagens.findOne({_id:req.body.id}).then((postagem)=>{

        if(postagem){
            postagem.titulo = req.body.titulo
            postagem.slug = req.body.slug
            postagem.descricao = req.body.descricao
            postagem.conteudo = req.body.conteudo
            postagem.categoria = req.body.categoria
     
            postagem.save().then(()=>{
                req.flash("success_msg", "Os dados foram salvos com sucesso")
                res.redirect("/admin/postagens")
            }).catch(()=>{
                req.flash("error_msg", "Houve um erro ao tentar salvar os dados")
                res.redirect("/admin/postagens")
            })
        }
    }).catch(()=>{
        req.flash("error_msg", "Hou um erro tecnico com sistema")
    })

      
})


router.post("/postagens/deletar", (req,res)=>{
    Postagens.deleteOne({_id:req.body.id}).then(()=>{
        req.flash("success_msg","Postagem delectada com sucesso")
        res.redirect("/admin/postagens")
    }).catch(()=>{
        req.flash("error_msg","Houve um erro ao tentar Delectar a Postagem")
        res.redirect("/admin/postagens")

    })
})




module.exports = router
