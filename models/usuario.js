const mongoose = require("mongoose")
const Schema = mongoose.Schema



const usuario = new Schema({
    username:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    passwordConfirm:{
        type:String
    },
})


mongoose.model("usuario", usuario)