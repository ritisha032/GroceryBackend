import JWT from "jsonwebtoken";
import User from "../models/User.js";
export const requireSignIn=async(req,res,next)=>{
    try{

        const decode = JWT.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
          );
        req.user=decode;
        next();

    }catch(error){
        console.error(error);
    }
}
//admin accesss
export const isAdmin=async(req,res,next)=>{
    try{
       
        const user = await User.findById(req.user._id);
        if(req.user.role !== 1)
        {
           return res.status(400).json({
            success:false,
            message:"User is not an admin",
           });
        }
        else{
            next();
        }
    }catch(error){
        console.error(error);
    }
}