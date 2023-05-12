const bcrypt = require('bcryptjs');
const saltRounds = 10;
const secretKey ="Asnfkjfj@12ejfniej"
const jwt = require("jsonwebtoken")


const hashpassword = async(password)=>{
  let salt = await bcrypt.genSalt(10)
  console.log(salt)
  let hashedPassword = await bcrypt.hash(password,salt)
  return hashedPassword;
}

const hashcompare = async(password,hashedPassword)=>{
     return await bcrypt.compare(password,hashedPassword)
}

const createToken = async(payload)=>{
    console.log(payload)
    let token = await jwt.sign(payload, secretKey, { expiresIn: "2m" })
  return token
}

const validate = async (req,res,next) => {
  if(req.headers.authorization)
  {
    let token = req.headers.authorization.split(" ")[1]
    let data = await jwt.decode(token)
    if(Math.floor((+new Date())/1000)<data.exp)
       next()
     else 
     res.status(400).send({ message:"token expired"})  
  
  }else{
    res.status(401).send({message:"Invalid token"})
  }

}

const roleAdminGuard = async (req, res,next) =>{
  if(req.headers.authorization)
  {
    let token = req.headers.authorization.split(" ")[1]
    let data = await jwt.decode(token)
    if(data.role==="admin")
       next()
     else 
     res.status(400).send({ message:"only admin are allowed"})  
  
  }else{
    res.status(401).send({message:"Invalid token"})
  }

}

module.exports ={hashcompare, hashpassword,createToken,validate,roleAdminGuard}