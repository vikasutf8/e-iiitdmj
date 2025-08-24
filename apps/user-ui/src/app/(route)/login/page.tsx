'use client'

import React, { useState } from 'react'
import {
    QueryClient,
    QueryClientProvider,
    useMutation,
    useQuery,
} from '@tanstack/react-query'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// eslint-disable-next-line @nx/enforce-module-boundaries
import GoogleIcon from 'apps/user-ui/src/shared/components/google-icon'
import { Eye, EyeOff } from 'lucide-react'
import axios,{AxiosError} from 'axios'

type FormData = {
    email: string ,
    password: string
}
const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [remeberMe, setRemeberMe] = useState(false);

    const router = useRouter();


    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const loginMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/login-user`, data,{
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: (data:FormData) => {
           setServerError(null);
          router.push("/dashboard");
        },
        onError: (error: AxiosError) => {
            const errorMessage = (error.response?.data as {message?:string}).message || error.message ||"Invalid Credentials";
            setServerError(errorMessage);
        },
    });

    const onSubmit = async (data: FormData) => {
            loginMutation.mutate(data);
    }

    return (
        <div className='w-full min-h-[85vh] py-10 bg-[#f1f1f1]'>

            <h1 className='text-4xl font-poppins font-semibold text-black text-center'>Login</h1>
            <p className='text-lg text-center font-medium py-3 text-[#00000080]'>Login to your account</p>
            <div className='w-full flex items-center justify-center'>
                <div className='md:w-[480px] bg-white shadow-md rounded-lg border-2 border-gray-300 px-10 py-5 m-5'>
                    <h3 className='text-3xl font-semibold text-center mb-3  '>
                        Login to Eshop
                    </h3>
                    <p className='text-center text-gray-500 mb-5'>
                        Dont have an account?{" "}
                        <Link href={"/signup"} className='text-blue-400'>Sign Up</Link>
                    </p>
                    <GoogleIcon />
                    <div className='flex  items-center my-5 text-gray-400 text-sm'>
                        <div className='flex-1 border-t border-gray-300 ' />
                        <span className='px-2'>Or continue with email</span>
                        <div className='flex-1 border-t border-gray-300 ' />
                    </div>


                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label className='block text-sm font-medium text-gray-700'>Email</label>
                        <input type="email" className='w-full p-2 border border-gray-300 !rounded outline-0' 
                        placeholder="someone@example.com"
                        {...register('email',{
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


                        <label className='block text-sm font-medium text-gray-700 mt-3'>Password</label>
                        <div className='relative'>
                         <input type={passwordVisible ? 'text' : 'password'} className='w-full p-2 border border-gray-300 !rounded outline-0' 
                        placeholder="Minimum 6 characters"
                        {...register('password',{
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
                                passwordVisible ? <Eye/> : <EyeOff/>
                            }
                        </button>
                          {
                            errors.password &&
                            <p className='text-red-500 text-sm'>
                                {String(errors.password?.message)}
                            </p>
                        }

                       
                       </div>
                        <div className='flex justify-between items-center  my-4'>
                            <label htmlFor="rememberMe">
                                <input type='checkbox'
                                 className='text-md'
                                 checked={remeberMe} 
                                 onChange={() => setRemeberMe(!remeberMe)}
                                />
                                <span className='ml-2 text-md'>Remember me</span>
                            </label>
                            <Link href={"/forgot-password"} className='text-blue-400 text-md active:underline active:text-blue-300'>Forgot password?</Link>
                        </div>

                        <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className='w-full text-xl font-bold cursor-pointer bg-[#000000d6] active:bg-black text-white py-2 rounded-lg'>
                            {loginMutation.isPending ? "Logging..." : "Login"}
                        </button>
                        {serverError && <p className='text-red-500 text-sm'>{serverError}</p>}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login