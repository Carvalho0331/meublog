const mongoose = require("mongoose")
const Schema = mongoose.Schema


const Postagens = new Schema({
    titulo:{
        type:String
    },
    descricao:{
        type:String
    },
    slug:{
        type:String
    },
    conteudo:{
        type:String
    },
    categoria:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Categorias"
    },
     data:{
        type:Date,
        default:Date.now()
    }
})



mongoose.model("Postagens",Postagens)