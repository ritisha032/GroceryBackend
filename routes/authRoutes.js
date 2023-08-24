import express from "express";
const router=express.Router();

import {signup,login,forgotPasswordController, updateProfileController, getOrdersController, getUserById, getAllOrdersController, orderStatusController} from "../controllers/authController.js";
import { requireSignIn,isAdmin} from "../middleware/authMiddleware.js";


router.post("/signup",signup);
router.post("/login",login);
router.post("/forgot-password",forgotPasswordController);

//protected routes
router.get("/user-auth",requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
});

router.get('/user/:id',getUserById)

//protected route for admin

//protected routes
router.get("/admin-auth",requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders

router.get('/orders',requireSignIn,getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);


export default router;
