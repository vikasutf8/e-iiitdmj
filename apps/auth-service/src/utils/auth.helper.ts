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

    if(await redis.get(`otp_lock:${email}`)){
       return next( new ValidationError("Account locked !! Multiple Failed login attempts ,Try after 30 minutes"));
    }

    if(await redis.get(`otp_spam_lock:${email}`)){
        return next( new ValidationError("Account locked !! Too many OTP Requested , Wait after otp")); 
    }

    if(await redis.get(`otp_cooldown:${email}`)){
        return next( new ValidationError("Account locked !! OTP cooldown time , Wait 1 min for next otp")); 
    }


}


export const trackOtpRequest = async (email:string,next:NextFunction)=>{
    const otpRequestkey = `otp_request_count:${email}`;
    let otpRequests =parseInt((await redis.get(otpRequestkey)) || "0")


    if(otpRequests>=2){
        await redis.set(`otp_spam_lock:${email}`, "locked", "EX",3600); //lock for 1 hour
        return next( new ValidationError("Account locked !! Too many OTP Requested , Wait 1 hour for next otp"));
    }

    await redis.set(otpRequestkey,otpRequests+1,"EX",3600); //track otp request 1 hour

}

export const sentOtp =async (name:string,email:string, template:string)=>{
    const otp = crypto.randomInt(1000,9999).toString();

    // set this otp in redis {otp,userEmail} also expiry time
    await sendEmail(email,"Verify your email",template,{name,otp});
    await redis.set(`otp:${email}`,otp, "EX",300);
    await redis.set(`otp_cooldown:${email}`, "true", "EX",60);

}
