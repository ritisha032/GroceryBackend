import express from "express";
import { isAdmin,requireSignIn } from "../middleware/authMiddleware.js";
import { createCategoryController, updateCategoryController,categoryControlller,singleCategoryController,deleteCategoryCOntroller } from "../controllers/categoryController.js";

const router=express.Router();

router.post("/create-category",requireSignIn,isAdmin,createCategoryController);
router.put("/update-category/:id",requireSignIn,isAdmin,updateCategoryController);

//get-all category;

router.get("/get-category",categoryControlller);
//single category
router.get("/single-category/:slug", singleCategoryController);

//delete category
router.delete(
    "/delete-category/:id",
    requireSignIn,
    isAdmin,
    deleteCategoryCOntroller
  );


export default router;