const express=require("express");
const router=express.Router();
 const UserRouter=require("./UserRouter")
 const AuthRouter=require("./AuthRouter")
router.use("/v1/users",UserRouter)
router.use("/v1/auth",AuthRouter)

module.exports=router