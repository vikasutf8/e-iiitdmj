import { Request, Response, NextFunction } from 'express';
import {
  checkOtpRestrictions,
  sentOtp,
  trackOtpRequest,
  validateRegistrationData,
  verifyOtp,
} from '../utils/auth.helper';
import prisma from '../../../../packages/libs/prisma';
import {
  AuthenticationError,
  ValidationError,
} from '../../../../packages/error-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { setCookies } from '../utils/cookies/setCookies';

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

    res.status(200).json({
      status: 'success',
      success: true,
      message: 'User registered successfully',
      user,
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
    const isPasswordValid = await bcrypt.compare(password, user.password);
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

    //store refresh token and access token in httpOnly cookie
    setCookies(res,"refreshToken",refreshToken);
    setCookies(res,"accessToken",accessToken);

    res.status(200).json({
      status: 'success',
      success: true,
      message: 'User logged in successfully',
      user:{id:user.id,email:user.email,name:user.name}
        
    });
  } catch (error) {
    return next(error);
  }
};
