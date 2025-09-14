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
import toast from 'react-hot-toast'
// eslint-disable-next-line @nx/enforce-module-boundaries
import GoogleIcon from 'apps/user-ui/src/shared/components/google-icon'
import { Eye, EyeOff } from 'lucide-react'
import axios, { AxiosError } from 'axios'

type FormData = {
    email: string,
    password: string
}
const ForgotPassword = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [step, setStep] = useState<"email" | "otp" | "reset">("email");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [userEmail, setUserEmail] = useState<string>("");
    const [canResend, setCanResend] = useState(true);
    const [timer, setTimer] = useState(60);
    const inputRef = useRef<(HTMLInputElement | null)[]>([]);

    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();


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


    const requestOtpMutation = useMutation({
        mutationFn: async ({ email }: { email: string }) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/forgot-password-user`, { email });
            return response.data;
        },

        onSuccess: (_, { email }) => {
            setStep("otp");
            setUserEmail(email);
            setServerError(null);
            setCanResend(false);
            startResendTimer();
        },
        onError: (error: AxiosError) => {
            const errorMessage = (error.response?.data as { message?: string }).message || error.message || "Invalid OTP .try again";
              console.log(error,"jkfghaksdf")
            console.log(errorMessage + "request otp mutations")
            setServerError(errorMessage);
        },


    });

    const verifyOtpMutation = useMutation({
        mutationFn: async () => {
            if (!userEmail) { return; }
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/verify-forgot-password-user`, { email: userEmail, otp: otp.join("") });
            return response.data;
        },
        onSuccess: () => {
            setStep("reset");

            setServerError(null);
        },
        onError: (error: AxiosError) => {
            const errorMessage = (error.response?.data as { message?: string }).message || error.message || "Invalid OTP .try again";
            console.log(error,"jkfghaksdf")
             console.log(errorMessage + "verify otp mutation")
            setServerError(errorMessage);
        },
    })

    const resetPasswordMutation = useMutation({
        mutationFn: async ({ password }: { password: string }) => {
            if (!password) { return; }
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/reset-password-user`, { email: userEmail, newPassword: password });
            return response.data;
        },
        onSuccess: () => {
            setStep("email");
            setServerError(null);
            toast.success("Password reset successfully");
            router.push("/login");
        },
        onError: (error: AxiosError) => {
            const errorMessage = (error.response?.data as { message?: string }).message || error.message || "Invalid OTP .try again";
             console.log(errorMessage + "reset otp mutations")
            setServerError(errorMessage);
        },
    })


    const onSubmitEmail = ({ email }: { email: string }) => {
        requestOtpMutation.mutate({ email });
    }
    const onSubmitPassword = ({ password }: { password: string }) => {
        resetPasswordMutation.mutate({ password });
    }

    return (
        <div className='w-full min-h-[85vh] py-10 bg-[#f1f1f1]'>

            <h1 className='text-4xl font-poppins font-semibold text-black text-center'> Forgot Password</h1>
            <p className='text-lg text-center font-medium py-3 text-[#00000080]'>Enter your email to reset password</p>
            <div className='w-full flex items-center justify-center'>
                <div className='md:w-[480px] bg-white shadow-md rounded-lg border-2 border-gray-300 px-10 py-5 m-5'>
                    {step === "email" && (
                  <>
                    <h3 className='text-3xl font-semibold text-center mb-3  '>
                        Login to Eshop
                    </h3>
                    <p className='text-center text-gray-500 mb-5'>
                        Go back to?{" "}
                        <Link href={"/login"} className='text-blue-400'>Login</Link>
                    </p>
                    <form onSubmit={handleSubmit(onSubmitEmail)}>
                        <label className='block text-sm font-medium text-gray-700'>Email</label>
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
                        <button
                            type="submit"
                            disabled={requestOtpMutation.isPending}
                            className='w-full mt-4 text-xl font-bold cursor-pointer bg-[#000000d6] active:bg-black text-white py-2 rounded-lg'>
                            {requestOtpMutation.isPending ? "Sending OTP..." : "Submit"}
                        </button>
                        {serverError && <p className='text-red-500 text-sm'>{serverError}</p>}
                    </form>
                    </>
                    )}

                   { step === "otp" && (
                    <>
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
                        {/* ??? */}
                            
                        {/* verifyOtpMutation.isError && (
                                verifyOtpMutation.error instanceof AxiosError ?
                                    <p className='text-red-500 text-sm'>
                                        {String(verifyOtpMutation.error)}
                                    </p>
                                
                            ) */}

                    </>
                    )

                }
                    {step === "reset" && (
                    <>
                        <h3 className='text-xl font-bold text-center mb-4'>New Password</h3>
                        <form onSubmit={handleSubmit(onSubmitPassword)}>
                            <label className='block text-sm font-medium text-gray-700'>Password</label>
                            <input type="password" className='w-full p-2 border border-gray-300 !rounded outline-0'
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
                            {
                                errors.password &&
                                <p className='text-red-500 text-sm'>
                                    {String(errors.password?.message)}
                                </p>
                            }

                            <button
                                type="submit"
                                disabled={resetPasswordMutation.isPending}
                                className='mt-4 w-full text-xl font-bold cursor-pointer bg-[#000000d6] active:bg-black text-white py-2 rounded-lg'>
                                {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                            </button>
                            {serverError && <p className='text-red-500 text-sm'>{serverError}</p>}
                        </form>
                    </>
                    )
                }
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword