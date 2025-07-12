
import { Request, Response, NextFunction, } from 'express';
import { AppError } from "./index";

export const errorMiddleware = (err:Error, req:Request, res:Response, next:NextFunction) => {
  if(err instanceof AppError){
    console.log(`[ERROI] ${req.method} ${req.url}-${err.statusCode} | ${err.message}`);
    res.status(err.statusCode).json({
      status:"error",
      message:err.message,
      ...(err.details && {details:err.details}),
    });
  }

  console.log("Unhandled error",err);

  return res.status(500).json({
    status:"error",
    message:"Internal Server Error Unhandle error",
  });
};