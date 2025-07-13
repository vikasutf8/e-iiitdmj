import crypto from 'crypto';
import { ValidationError } from '../../../../packages/error-handler';
import { NextFunction } from 'express';
import redis from '../../../../packages/libs/redis';
import { sendEmail } from './sendMail';

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const validateRegistrationData = async (
  data: any,
  userType: 'user' | 'seller'
) => {
  const { email, password, name, phone_number, country } = data;

  if (
    !email ||
    !password ||
    !name ||
    (userType === 'seller' && !phone_number && !country)
  ) {
    throw new ValidationError('Missing required fields');
  }
  // email validation
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email');
  }
};


export const checkOtpRestrictions = async (email:string,next:NextFunction)=>{
    // Redis
}


export const sentOtp =async (name:string,email:string, template:string)=>{
    const otp = crypto.randomInt(1000,9999).toString();

    // set this otp in redis {otp,userEmail} also expiry time
    await sendEmail(email,"Verify your email",template,{name,otp});
    await redis.set(`otp:${email}`,otp, "EX",300);
    await redis.set(`otp_cooldown:${email}`, "true", "EX",60);

}
