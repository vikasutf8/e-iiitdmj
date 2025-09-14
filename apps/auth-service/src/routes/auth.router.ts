/* eslint-disable @nx/enforce-module-boundaries */

import express ,{Router} from "express";
import { forgotPassword, getUserInfo, loginUser, refreshToken, resetUserPassword, userRegistration, verifyUser, verifyUserForgotPassword } from "../controllers/auth.controller";
import  {isAuthenticated}  from "../../../../packages/middleware/isAuthenticated";

const router:Router = express.Router();

router.post("/user-registration",userRegistration)
router.post("/verify-user",verifyUser)
router.post("/login-user",loginUser)
router.post("/refresh-token-user",refreshToken)
router.get("/logged-in-user",isAuthenticated,getUserInfo)    
router.post("/forgot-password-user",forgotPassword)
router.post("/verify-forgot-password-user",verifyUserForgotPassword)
router.post("/reset-password-user",resetUserPassword)


export default router;