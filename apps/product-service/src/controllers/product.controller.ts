//get products category
import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../../../packages/libs/prisma';
import { NotFoundError, ValidationError } from '@packages/error-handler';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const config = await prisma.site_config.findFirst();
    if (!config) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(config.categories);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//create discount code

export const createDiscountCode = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { public_name, discountType, discountValue, discountCode } = req.body;
    // if(!public_name || !discountType || !discountValue || !discountCode || !sellerId){
    //   return next(new ValidationError("Please provide all the required fields"));
    // }

    const isDiscountCodeExists = await prisma.discount_codes.findUnique({
      where: {
        discountCode,
      },
    });

    if (isDiscountCodeExists) {
      return next(
        new ValidationError(
          'Discount code already exists !! Please try with different discount code'
        )
      );
    }

    const discount_code = await prisma.discount_codes.create({
      data: {
        public_name,
        discountType,
        discountValue: parseFloat(discountValue),
        discountCode,
        sellerId: req.seller.id,
      },
    });

    res.status(200).json({
      status: 'success',
      success: true,
      message: 'Discount code created successfully',
      discount_code,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//get discount code
export const getDiscountCode = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const discount_codes = await prisma.discount_codes.findMany({
      where: {
        sellerId: req.seller.id,
      },
    });

    res.status(200).json({
      status: 'success',
      success: true,
      message: 'Discount codes found successfully',
      discount_codes,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//delete discount code
export const deleteDiscountCode = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;
    const sellerId = req.seller.id;
    //ownership check
    const discount_code = await prisma.discount_codes.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        sellerId: true,
      },
    });

    if (!discount_code) {
      return next(new NotFoundError('Discount code not found'));
    }

    if (discount_code.sellerId !== sellerId) {
      return next(new ValidationError('Unauthorized'));
    }

    await prisma.discount_codes.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: 'success',
      success: true,
      message: 'Discount code deleted successfully',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
