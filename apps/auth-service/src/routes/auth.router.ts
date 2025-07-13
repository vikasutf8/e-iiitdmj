
import express ,{Router} from "express";
import { userRegistration } from "../controllers/auth.controller";


const router:Router = express.Router();

router.post("/user-registration",userRegistration)

export default router;