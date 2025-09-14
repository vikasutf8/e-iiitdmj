/* eslint-disable @nx/enforce-module-boundaries */
import { Request, Response, NextFunction } from 'express';
import {
  checkOtpRestrictions,
  handleForgotPassword,
  sentOtp,
  trackOtpRequest,
  validateRegistrationData,
  verifyforgetPasswordOtp,
  verifyOtp,
} from '../utils/auth.helper';
import prisma from '../../../../packages/libs/prisma';
import {
  AuthenticationError,
  ValidationError,
} from '../../../../packages/error-handler';
import bcrypt from 'bcryptjs';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { setCookies } from '../utils/cookies/setCookies';

//Register a new user


//role attached "user"
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, 'user');
    const { email, name } = req.body;

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
    return next(error);
  }
};

//verify iser with OTP

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, name, password } = req.body;
    if (!email || !otp || !name || !password) {
      return next(
        new ValidationError('Please provide all the required fields')
      );
    }

    const isUserExists = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (isUserExists) {
      return next(new ValidationError('User already exists with this email'));
    }
    await verifyOtp(email, otp, next);

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        email,
        password: hashPassword,
        name,
      },
    });
    // updateing user as can return response remove password
 

    res.status(200).json({
      status: 'success',
      success: true,
      message: 'User registered successfully',
      user,//later hvaw to remove
    });
  } catch (error) {
    return next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new ValidationError('Please provide all the required fields')
      );
    }   

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return next(
        new AuthenticationError(
          'Invalid User ! Please check your email and password'
        )
      );
    }

    //verify password
    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      return next(new AuthenticationError('Invalid password'));
    }
    //generate access and refresh token
    const accessToken = jwt.sign(
      { id: user.id, role: 'user' },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: '15m',
      }
    );
    const refreshToken = jwt.sign(
      { id: user.id, role: 'user' },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: '7d',
      }
    );

    // console.log("refreshToken",refreshToken);
    // console.log("accessToken",accessToken);
    //store refresh token and access token in httpOnly cookie
    setCookies(res, 'refreshToken', refreshToken);
    setCookies(res, 'accessToken', accessToken);

    console.log(user+"this ios login-user coming ");
    res.status(200).json({
      status: 'success',
      success: true,
      message: 'User logged in successfully',
      data: { id: user.id, email: user.email, name: user.name },
      user, //have to remove it later
    });
  } catch (error) {
    return next(error);
  }
};

//forgot password
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await handleForgotPassword(req, res, next, 'user');
};

//verify forget password OTP
export const verifyUserForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await verifyforgetPasswordOtp(req, res, next);
};

//reset password
export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return next(new ValidationError('Please provide all the required fields'));
  }
  //find user in db

  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return next(new ValidationError('User not found'));
  }

  //compare password
  const isSamePassword = await bcrypt.compare(newPassword, user.password!);
  if (isSamePassword) {
    return next(new ValidationError('New password is same as old password'));
  }

  //hash new password
  const hashPassword = await bcrypt.hash(newPassword, 10);

  //update password
  await prisma.users.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashPassword,
    },
  });

  res.status(200).json({
    status: 'success',
    success: true,
    message: 'Password Reset Successfully',
  });
};


//refresh token user

export const refreshToken= async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.cookies;
    if(!refreshToken){
      return next(new ValidationError('Refresh token not found ! UnAuthorized'));
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as {id:string,role:string};
    if(!decoded ||  !decoded.role || !decoded.id){
      return next(new JsonWebTokenError('Invalid refresh token ! Forbidden'));
    }

    // let account ;
    // if(decoded.role === 'user'){
      const user = await prisma.users.findUnique({
        where: {
          id: decoded.id,
        },
      });
    
    if(!user){
      return next(new AuthenticationError('User not found ! UnAuthorized'));
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, role:decoded.role },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: '15m',
      }
    );

    setCookies(res, 'accessToken', newAccessToken);

    res.status(200).json({
      status: 'success',
      success: true,
      message: 'Token refreshed successfully',
     
    });


  } catch (error) {
    return next(error);
  }
}; 


// get logged in userInfo

export const getUserInfo = async (
  req: any,
  res: Response,
  next: NextFunction
)=>{
  try {
    const { user } = req
    res.status(201).json({
      status: 'success',
      success: true,
      user,
    });
  } catch (error) {
    next(error);  
  }

}