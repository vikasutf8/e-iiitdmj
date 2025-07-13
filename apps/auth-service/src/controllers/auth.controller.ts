import { Request, Response, NextFunction } from 'express';
import { checkOtpRestrictions, trackOtpRequest, validateRegistrationData } from '../utils/auth.helper';
import prisma from '../../../../packages/libs/prisma';
import { ValidationError } from '../../../../packages/error-handler';

//Register a new user

export const  userRegistration = async (req:Request,res:Response,next:NextFunction)=>{
    validateRegistrationData(req.body,'user');
    const {email,name} = req.body;

    const existingUser = await prisma.users.findUnique({
        where:{
            email,
        },
    });

    if(existingUser){
        throw new ValidationError("User already exists");
    }

    //otp  : send otp 1. checking regisation data 2. user is new 3. adding restrictions 

    await checkOtpRestrictions(email,next)
    await trackOtpRequest(email,next)

};