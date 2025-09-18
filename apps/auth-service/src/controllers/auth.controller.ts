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
import Stripe from 'stripe';
import {
  AuthenticationError,
  ValidationError,
} from '../../../../packages/error-handler';
import bcrypt from 'bcryptjs';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { setCookies } from '../utils/cookies/setCookies';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! as string, {
  apiVersion: '2025-08-27.basil',
});


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

    // removing seller accessToken and refreshToken
    res.clearCookie('SellerAccessToken'); 
    res.clearCookie('SellerRefreshToken');


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
//refresh token user | Seller
export const refreshToken= async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken =
      req.cookies['refreshToken'] ||
      req.cookies['SellerRefreshToken'] ||
      req.headers?.authorization?.split(' ')[1];

    if(!refreshToken){
      return next(new ValidationError('Refresh token not found ! UnAuthorized'));
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as {id:string,role:string};
    if(!decoded ||  !decoded.role || !decoded.id){
      return next(new JsonWebTokenError('Invalid refresh token ! Forbidden'));
    }

    let account ;
    if(decoded.role === 'user'){
      account= await prisma.users.findUnique({
        where: {
          id: decoded.id,
        },
      });
    }
    else if(decoded.role === 'seller'){
      account = await prisma.sellers.findUnique({
        where: {
          id: decoded.id,
        },
        include: {
          shops: true,
        },
      });
    }

    if(!account){
      return next(new AuthenticationError('Account not found ! UnAuthorized User/seller'));
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, role:decoded.role },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: '15m',
      }
    );

    if(decoded.role === 'user'){
      setCookies(res, 'accessToken', newAccessToken);
    }else if(decoded.role === 'seller'){
      setCookies(res, 'SellerAccessToken', newAccessToken);
    }

    req.role = decoded.role;

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



/*
**********************
Seller Controller
************************
*/

// register a new seller
export const sellerRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, 'seller');
    const { email, name } = req.body;

    const existingSeller = await prisma.sellers.findUnique({
      where: {
        email,
      },
    });

    if (existingSeller) {
      throw new ValidationError('Seller already exists');
    }

    //otp  : send otp 1. checking regisation data 2. user is new 3. adding restrictions
    await checkOtpRestrictions(email, next);
    await trackOtpRequest(email, next);
    await sentOtp(name, email, 'seller-activation-mail');

    res.status(200).json({
      status: 'success',
      message: 'Otp sent successfully | Verify your account',
    }); 
    
  } catch (error) {
    return next(error);
  }
};
// verify seller OTP
export const verifySeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, name, password , phone_number,country } = req.body;
    if (!email || !otp || !name || !password || !phone_number || !country) {
      return next( new ValidationError('Please provide all the required fields'));
    }

    const isSellerExists = await prisma.sellers.findUnique({
      where: {
        email,
      },
    });
    if (isSellerExists) {
      return next(new ValidationError('Seller already exists with this email'));
    }

    await verifyOtp(email, otp, next);

    const hashPassword = await bcrypt.hash(password, 10);

    const seller = await prisma.sellers.create({
      data: {
        email,
        password: hashPassword,
        name,
        phone_number, 
        country,
      },
    });



    res.status(200).json({
      status: 'success',
      message: 'Seller activated successfully',
      seller,
    });
  } catch (error) {
    next(error);
  }
}
// create a new shop
export const createShop = async(
  req : Request,
  res: Response,
  next : NextFunction
)=>{
  try {
    const {name, bio, address , opening_hours,website,category,sellerId} =req.body;

    if(!name || !bio || !address || !opening_hours || !website || !category || !sellerId){
      return next(new ValidationError('Please fill all the fields'));
    }

    const shopData ={
      name,
      bio,
      address,  
      opening_hours,
      website,
      category,
      sellerId,
    }

    if(website && website.trim !== ''){
      shopData.website = website;
    }

    const shop = await prisma.shops.create({
      data: shopData,
    });

    res.status(201).json({
      status: 'success',
      success: true,
      message: 'Shop created successfully',
      shop,
    });


  } catch (error) {
    return next(error)
  }
}

// create strinpe connect account Link
export const createStripeConnectLink = async (
  req: Request,
  res: Response,
  next: NextFunction
)=>{
  try {
      const {sellerId} = req.body;
      if(!sellerId){
        return next(new ValidationError("Please provide valid sellerId"));
      }

      const seller = await prisma.sellers.findUnique({
        where: {
          id: sellerId,
        },
      });

      if(!seller){
        return next(new ValidationError("Seller not found"));
      }

      const stripeAccount = await stripe.accounts.create({
        type: 'express',
        country: 'IN', //GB -uk
        email: seller.email,
        capabilities: {
          card_payments: {
            requested: true,
          },
          transfers: {
            requested: true,
          },
        },
      });

      await prisma.sellers.update({
        where: {
          id: sellerId,
        },
        data: {
          stripeId: stripeAccount.id,
        },
      });

      const accountLink = await stripe.accountLinks.create({
        account: stripeAccount.id,
        // eslint-disable-next-line no-constant-binary-expression
        return_url: `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/stripe-account-link` || `http://localhost:3000/api/v1/success`,
        type: 'account_onboarding',
        // eslint-disable-next-line no-constant-binary-expression
        refresh_url: `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/stripe-account-link` || `http://localhost:3000/api/v1/success`,
        //   type: 'account_onboarding',
        //   refresh_url: `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/stripe-account-link`,
      });
      
      res.status(200).json({
        status: 'success',
        success: true,
        message: 'Stripe account created successfully',
        url: accountLink.url,
      });


  } catch (error) {
    next(error);
  }
}

// login seller
export const loginSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
)=>{
  try {
    const {email, password} = req.body;
    if(!email || !password){
      return next(new ValidationError('Please provide email and password'));
    }

    const seller = await prisma.sellers.findUnique({
      where: {
        email,
      },
    });

    if(!seller){
      return next(new AuthenticationError('Seller not found'));
    }

    const isPasswordValid = await bcrypt.compare(password, seller.password);
    if(!isPasswordValid){
      return next(new AuthenticationError('Invalid password'));
    }

    // removing user accessToken and refreshToken
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');


  //  accessToken && refreshToken
    const accessToken = jwt.sign(
      { id: seller.id, role: 'seller' },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: '15m',
      }
    );
    const refreshToken = jwt.sign(
      { id: seller.id, role: 'seller' },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: '7d',
      }
    );
// store refresh token and access token in httpOnly cookie
// IMPORTANT : if seller and customer login at same brower
    setCookies(res, 'SellerRefreshToken', refreshToken);
    setCookies(res, 'SellerAccessToken', accessToken);

    res.status(200).json({
      status: 'success',
      success: true,
      message: 'Seller logged in successfully',
      seller,
    });
  } catch (error) {
    next(error);
  } 
}


export const getSellerInfo = async (
  req: any,
  res: Response,
  next: NextFunction
)=>{
  try {
    const { seller } = req
    res.status(201).json({
      status: 'success',
      success: true,
      seller,
    });

  

  } catch (error) {
    next(error);  
  }

}