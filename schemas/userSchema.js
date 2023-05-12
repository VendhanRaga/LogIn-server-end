const validator = require("validator");
const mongoose = require("mongoose");
const {mongo_db} = require('../common/dbconfig')

mongoose.connect(mongo_db)


let userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{
        type:String,
        required:true,
        lowercase:true,
        validate:(value)=>{
            return validator.isEmail(value)
        }},
    mobile:{type:String,default:000-000-0000},
    password:{type:String,required:true},
    role:{type:String,default:'user'},
    createdAt:{type:String,default:Date.now}
})

let UserModel = mongoose.model('user',userSchema);

module.exports ={UserModel}