var express = require('express');
var router = express.Router();
const {UserModel}= require('../schemas/userSchema')
const mongoose = require('mongoose');
const {hashcompare,hashpassword, createToken,validate,roleAdminGuard}=require('../common/auth');

/* GET users listing. */
router.get('/',validate, roleAdminGuard, async function(req, res, next) {
     try {
       let user = await UserModel.find()
       res.status(200).send({user,message:"data fetched successfully"})
     } catch (error) {
      res.status(500).send({
        message:"server error",error
      })
     }
})
//get all users

// router.get('/', async (req, res,)=>  {
//   try {
//     let user = await UserModel.findOne({_id:req.params.id})
//     res.status(200).send({user,message:"all users found"})
//   } catch (error) {
//    res.status(500).send({
//      message:"server error",error
//    })
//   }
// })


//get by id

router.get('/:id', async (req, res,)=>  {
  try {
    let user = await UserModel.findOne({_id:req.params.id})
    res.status(200).send({user,message:"data fetched successfully"})
  } catch (error) {
   res.status(500).send({
     message:"server error",error
   })
  }
})
//sign up user
router.post('/signup',async (req,res)=>{
  try {
    let user = await UserModel.findOne({email:req.body.email})
    if(!user){
    
     let hashedPassword = await hashpassword(req.body.password)
     req.body.password
     let user = await UserModel.create(req.body)
    res.status(200).send({
      message:"user signed up successfully",hashedPassword
    })
  }
  else {
    res.status(403).send({message:"user Already signed up"})
  }
  } catch (error) {
    res.status(500).send({
      message:"internal error",error
    })
  }
})
//login user
router.post('/login',async (req,res)=>{
  try {
    let user = await UserModel.findOne({email:req.body.email})
    if(user){
      //verify that the password is correct
    if(await hashcompare(req.body.password,user.password))
    {  
      //create the token
      let token = await createToken({
        name: user.name,
        email: user.email,
        id: user._id,
        role: user.role
      })
      res.status(200).send({
      message:"user login successfully",token
    })}
     else {
      res.status(403).send({message:"invalid credentials"})
     }
     
     
  
  }
  else {
    res.status(403).send({message:"user does not exist",hashedPassword})
  }
  } catch (error) {
    res.status(500).send({
      message:"internal error",error
    })
  }
})

//delete by id

router.delete('/:id',async (req,res)=>{
  try {
    let user = await UserModel.findOne({_id:req.params.id})
    if(user){
    let user = await UserModel.deleteOne({_id:req.params.id})
    res.status(200).send({
      message:"user deleted successfully"
    })
  }
  else {
    res.status(403).send({message:"user does not exist"})
  }
  } catch (error) {
    res.status(500).send({
      message:"internal error",error
    })
  }
})

//update user

router.put('/:id',async (req,res)=>{
  try {
    let user = await UserModel.findOne({_id:req.params.id})
    if(user){
    user.name = req.body.name
    user.email = req.body.email
    user.password = req.body.password

    await user.save()
    
    res.status(200).send({
      message:"user updated successfully"
    })
  }
  else {
    res.status(403).send({message:"user does not exist"})
  }
  } catch (error) {
    res.status(500).send({
      message:"internal error",error
    })
  }
})

module.exports = router;
