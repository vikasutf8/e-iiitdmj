import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../packages/libs/prisma";


 export const isAuthenticated =async (req:any,res:Response,next:NextFunction)=>{
  try {
    const token = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
    if(!token){
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized',
      });
    }

    // verify token
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as {id:string,role:"user"|"seller"};
    if(!decoded ||  !decoded.role || !decoded.id){
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized !! Invalid token',
      });
    }
// getting data after comparing for id comming from token
    console.log(decoded,"decoded")
    const account =await prisma.users.findUnique({
      where: {
        id: decoded.id,
      },
    });
// set that data/user to req.user
    req.user = account;
console.log(req.user+"is authectication");
    if(!account){
      return res.status(401).json({
        status: 'error',
        message: 'Account not found',
      });
    }


return next()
    

  } catch (error:any) {
    return res.status(401).json({
      status: 'error',
      message: error.message ||"Error occured while verifying token",
    });
  }
}