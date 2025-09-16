
'use client'

import React, { useRef, useState } from 'react'
import {
    QueryClient,
    QueryClientProvider,
    useMutation,
    useQuery,
} from '@tanstack/react-query'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'


import { Eye, EyeOff } from 'lucide-react'
import axios, { AxiosError } from 'axios'
import { countries } from '../../../utils/countries'
import CreateShop from '../../../shared/modules/auth/createShop'


const SignUp = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [serverError, setServerError] = useState<string | null>(null);
    const [canResend, setCanResend] = useState(true);
    const [showOtp, setShowOtp] = useState(false);
    const [timer, setTimer] = useState(60);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [sellerData, setSellerData] = useState<FormData | null>(null);
    const [sellerId,setSellerId]= useState("")
    const inputRef = useRef<(HTMLInputElement | null)[]>([]);


    const { register, handleSubmit, formState: { errors } } = useForm();

    const startResendTimer = () => {
        const interval = setInterval(() => {
            setTimer(timer => {
                if (timer <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return timer - 1;
            })
        }, 1000);
    }

    // tanStack
    const signupMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/seller-registration`, data);
            return response.data;
        },
        onSuccess: (_, formData) => {
            setSellerData(formData);
            setShowOtp(true);
            setCanResend(false);
            setTimer(60);
            startResendTimer();
        },
    });

    const verifyOtpMutation = useMutation({
        mutationFn: async () => {
            if (!sellerData) return;
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/verify-seller`, {
                ...sellerData,
                otp: otp.join("")
            });
            return response.data;
        },
        onSuccess: (data) => {
            console.log(data ,"this verifice data")
            setSellerId(data?.seller?.id);
            setActiveStep(2)
        },
    });

    const onSubmit = async (data: any) => {
        signupMutation.mutate(data);
    }


    // OTP form handler

    const handleOtpChange = (index: number, value: string) => {
        // regex for only numbers
        if (!/^[0-9]?$/.test(value)) {
            return;
        }
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        // focus change handler
        if (value && index < inputRef.current.length - 1) {
            inputRef.current[index + 1]?.focus();
        }
    }

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRef.current[index - 1]?.focus();
        }

    }

    const resendOtp = () => {
        if (!sellerData) { return; }
        signupMutation.mutate(sellerData);
    }

    const connectPaypal = () => {
        console.log("paypal connect")
    }
    const connectStripe = async() => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/create-stripe-link`, {
                sellerId
            });
            if (response.data.status === "success" && response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.log("Stripe connect error", error);
        }
    }

    return (
        <div className='w-full flex flex-col items-center min-h-screen pt-10 '>
            {/* stepper */}
            <div className='relative flex items-center justify-between md:w-[50%] mb-8 '>
                <div className='absolute  top-[25%] left-0  md:w-[90%] w-[80%] h-1 bg-gray-100 -z-10 ' />
                {[1, 2, 3].map((step) => (
                    <div key={step} >
                        <div className={`w-10 h-10  flex items-center justify-center rounded-full  text-white font-bold ${step <= activeStep ? "bg-blue-500" : "bg-gray-400"}`}>
                            {step}
                        </div>
                        <span className='ml-[-15px]'>
                            {step === 1 ? "Create Account" : step === 2 ? "SetUp Shop" : "Connect Bank"}

                        </span>
                    </div>
                ))}

            </div>

            {/* steps content */}
            <div className='md:w-[480px] p-8 mt-10 bg-white shadow rounded-lg'>
                {activeStep === 1 && (
                    <>
                        {
                            !showOtp ? (
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <h3 className='text-2xl font-bold flex justify-center'>Create Account</h3>
                                    <label className='block text-sm font-medium text-gray-700 mt-3'>Name</label>
                                    <input type="text" className='w-full p-2 border border-gray-300 !rounded outline-0'
                                        placeholder="someone"
                                        {...register('name', {
                                            required: 'Name is required',

                                        }
                                        )}
                                    />
                                    {
                                        errors.name &&
                                        <p className='text-red-500 text-sm'>
                                            {String(errors.name?.message)}
                                        </p>
                                    }


                                    <label className='block text-sm font-medium text-gray-700 mt-3'>Email</label>
                                    <input type="email" className='w-full p-2 border border-gray-300 !rounded outline-0'
                                        placeholder="someone@example.com"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                message: 'Invalid email address'
                                            }
                                        }
                                        )}
                                    />
                                    {
                                        errors.email &&
                                        <p className='text-red-500 text-sm'>
                                            {String(errors.email?.message)}
                                        </p>
                                    }
                                    <label className='block text-sm font-medium text-gray-700 mt-3'>Phone Number</label>
                                    <input type='tel' placeholder='25252352532' className='w-full p-2 border border-gray-300 !rounded outline-0'
                                        {...register('phone_number', {
                                            required: 'Phone number is required',
                                            pattern: {
                                                value: /^[0-9]*$/,
                                                message: 'Invalid phone number'
                                            },
                                            minLength: {
                                                value: 10,
                                                message: 'Phone number must be at least 10 characters'
                                            },
                                            maxLength: {
                                                value: 10,
                                                message: 'Phone number must be at most 10 characters'
                                            }
                                        }
                                        )}
                                    />
                                    {
                                        errors.phone_number &&
                                        <p className='text-red-500 text-sm'>
                                            {String(errors.phone_number?.message)}
                                        </p>
                                    }


                                    {/* Country --on slect */}
                                    <label className='block text-sm font-medium text-gray-700 mt-3'>Country</label>
                                    <select
                                        className='w-full p-2 border border-gray-300 !rounded outline-0'
                                        {...register('country', {
                                            required: 'Country is required',
                                        })}
                                    >
                                        <option value="">Select your Country</option>
                                        {countries.map((country) => (
                                            <option key={country.code} value={country.code}>{country.name}</option>
                                        ))}
                                    </select>
                                    {
                                        errors.country &&
                                        <p className='text-red-500 text-sm'>
                                            {String(errors.country?.message)}
                                        </p>
                                    }

                                    <label className='block text-sm font-medium text-gray-700 mt-3'>Password</label>
                                    <div className='relative'>
                                        <input type={passwordVisible ? 'text' : 'password'} className='w-full p-2 border border-gray-300 !rounded outline-0'
                                            placeholder="Minimum 6 characters"
                                            {...register('password', {
                                                required: 'Password is required',
                                                minLength: {
                                                    value: 6,
                                                    message: 'Password must be at least 6 characters'
                                                }
                                            }
                                            )}
                                        />
                                        <button type='button'
                                            onClick={() => setPasswordVisible(!passwordVisible)}
                                            className='absolute right-2 inset-y-0 flex items-center text-gray-400'>
                                            {
                                                passwordVisible ? <Eye /> : <EyeOff />
                                            }
                                        </button>
                                        {
                                            errors.password &&
                                            <p className='text-red-500 text-sm'>
                                                {String(errors.password?.message)}
                                            </p>
                                        }


                                    </div>


                                    <button
                                        type="submit"
                                        disabled={signupMutation.isPending}
                                        className='mt-4 w-full text-xl font-bold cursor-pointer bg-[#000000d6] active:bg-black text-white py-2 rounded-lg'>
                                        {signupMutation.isPending ? "Signing Up..." : "SignUp"}
                                    </button>

                                    {
                                        signupMutation.isError &&
                                        signupMutation.error instanceof AxiosError &&
                                       (
                                         <p className='text-red-500 text-sm'>{signupMutation.error.response?.data?.message || signupMutation.error.message}</p>
                                       )
                                    }

                                    {serverError && <p className='text-red-500 text-sm'>{serverError}</p>}

                                    <p className='text-center pt-3'>
                                        Already have an account?{" "} <Link href="/login" className='text-blue-500'>Login</Link>
                                    </p>
                                </form>
                            ) : (
                                <div>
                                    <h3 className='text-xl font-bold text-center mb-4'>Enter OTP</h3>
                                    <div className='flex justify-center gap-6'>
                                        {
                                            otp?.map((item, index) => {
                                                return <input
                                                    type="text"
                                                    key={index}
                                                    className='w-12 h-12 text-center border border-gray-300 outline-none !rounded'
                                                    // automatic moved to next otp box --that why its important
                                                    ref={
                                                        (ele) => {
                                                            if (ele) {
                                                                inputRef.current[index] = ele;
                                                            }
                                                        }
                                                    }
                                                    maxLength={1}
                                                    value={item}

                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                />
                                            })
                                        }
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={verifyOtpMutation.isPending}
                                        onClick={() => verifyOtpMutation.mutate()}
                                        className='mt-4 w-full text-xl font-bold cursor-pointer bg-[#000000d6] active:bg-black text-white py-2 rounded-lg'>
                                        {verifyOtpMutation.isPending ? "Verifying OTP..." : "Verify OTP"}
                                    </button>
                                    <p className='text-center text-sm mt-4'>
                                        {
                                            canResend ?
                                                <button
                                                    onClick={resendOtp}
                                                    className='text-blue-400 cursor-pointer'
                                                >Resend OTP</button>
                                                :
                                                `Resend OTP in ${timer} seconds`
                                        }
                                    </p>
                                    {
                                        verifyOtpMutation.isError &&
                                        verifyOtpMutation.error instanceof AxiosError &&
                                        <p className='text-red-500 text-sm'>{verifyOtpMutation.error.response?.data?.message || verifyOtpMutation.error.message}</p>}
                                </div>
                            )
                        }
                    </>
                ) }
                {
                    activeStep === 2 && (
                        <CreateShop sellerId={sellerId} setActiveStep={setActiveStep} />
                    )
                }
                {
                    activeStep === 3 && (
                       <div className='text-center'>
                           <h3 className='text-2xl font-bold flex justify-center'>Withdraw Method</h3>
                           <br />
                           <div className='flex gap-4'>
                               <button className='mt-4 w-1/2 text-xl cursor-pointer bg-[#0000008c] hover:bg-black active:bg-black text-white py-2 rounded-lg'
                               onClick={connectPaypal}>
                                   Connect Paypal
                               </button>
                               <button className='mt-4 w-1/2 text-xl cursor-pointer bg-[#0000008c] hover:bg-black active:bg-black text-white py-2 rounded-lg'
                               onClick={connectStripe}
                               >
                                   Connect Stripe
                               </button>
                           </div>
                       </div>
                    )
                }
            </div>

        </div>

    )
}

export default SignUp