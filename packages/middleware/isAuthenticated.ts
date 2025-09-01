import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";


 export const isAuthenticated =async (req:any,res:Response,next:NextFunction)=>{
  try {
    const token = req.cookies.accessToken || req.headers.authorization.split(" ")[1];
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

    const account =await prisma.users.findUnique({
      where: {
        id: decoded.id,
      },
    });

    req.user = account;

    if(!account){
      return res.status(401).json({
        status: 'error',
        message: 'Account not found',
      });
    }


return next()
    

  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: "Error occured while verifying token",
    });
  }
}