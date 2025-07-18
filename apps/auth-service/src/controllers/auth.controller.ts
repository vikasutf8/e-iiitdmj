import { Request, Response, NextFunction } from 'express';
import {
  checkOtpRestrictions,
  sentOtp,
  trackOtpRequest,
  validateRegistrationData,
  verifyOtp,
} from '../utils/auth.helper';
import prisma from '../../../../packages/libs/prisma';
import { ValidationError } from '../../../../packages/error-handler';
import bcrypt from 'bcryptjs';

//Register a new user

export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, 'user');
    const { email, name } = req.body;
    console.log('PRISMA DATABASE URI', process.env.DATABASE_URI);
    console.log(prisma.users);
    const existingUser = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new ValidationError('User already exists');
    }

    //otp  : send otp 1. checking regisation data 2. user is new 3. adding restrictions

    await checkOtpRestrictions(email, next);
    await trackOtpRequest(email, next);
    await sentOtp(name, email, 'user-activation-mail');

    res.status(200).json({
      status: 'success',
      message: 'Otp sent successfully | Verify your account',
    });
  } catch (error) {
    console.log('user registration error', error);
    return next(error);
  }
};


//verify iser with OTP

export const verifyUser =async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp,name,password } = req.body;
        if(!email || !otp || !name || !password){
            return next(new ValidationError('Please provide all the required fields'));
        }

        const isUserExists = await prisma.users.findUnique({
            where: {
                email,
            },
        });

        if(isUserExists){
           return next(new ValidationError('User already exists with this email'));
        }
        await verifyOtp(email,otp,next);

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
            data: {
                email,
                password: hashPassword,
                name
            },
        });

        res.status(200).json({
            status: 'success',
            success: true, 
            message: 'User registered successfully',
            user,
        });


    } catch (error) {
        return next(error);
    }
}
