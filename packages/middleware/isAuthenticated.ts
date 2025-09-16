import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import prisma from '../../packages/libs/prisma';

export const isAuthenticated = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies['accessToken'] ||
      req.cookies['SellerAccessToken'] ||
      req.headers?.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized',
      });
    }

    // verify token
    const decoded = (await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    )) as { id: string; role: 'user' | 'seller' };
    if (!decoded || !decoded.role || !decoded.id) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized !! Invalid token',
      });
    }
    // getting data after comparing for id comming from token
    let account;
    if (decoded.role === 'user') {
      account = await prisma.users.findUnique({
        where: {
          id: decoded.id,
        },
      });
      // set that data/user to req.user
      req.user = account;
    }else if (decoded.role === 'seller') {
      account = await prisma.sellers.findUnique({
        where: {
          id: decoded.id,
        },
        include: {
          shops: true,
        },
      });
      // set that data/seller to req.seller
      req.seller = account;
    }
      
      if (!account) {
        return res.status(401).json({
          status: 'error',
          message: 'Account not found',
        });
      }

      req.role = decoded.role;
      return next();
    }
  
  catch (error: any) {
    return res.status(401).json({
      status: 'error',
      message: error.message || 'Error occured while verifying token',
    });
  }
};
