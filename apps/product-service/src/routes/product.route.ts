import express,{ Router } from "express";
import { createDiscountCode, deleteDiscountCode, getCategories, getDiscountCode } from "../controllers/product.controller";
import { isAuthenticated } from "@packages/middleware/isAuthenticated";


const router:Router = express.Router();


router.get("/get-categories",getCategories);

// create discount code
router.post("/create-discount-code",isAuthenticated,createDiscountCode);
router.get("/get-discount-code",isAuthenticated,getDiscountCode);
router.delete("/delete-discount-code",isAuthenticated,deleteDiscountCode);

export default router;