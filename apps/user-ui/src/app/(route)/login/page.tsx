'use client'

import React, { useState } from 'react'
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import GoogleIcon from 'apps/user-ui/src/shared/components/google-icon'

type FormData = {
    email: string,
    password: string
}
const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [remeberMe, setRemeberMe] = useState(false);

    const router = useRouter();


    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {

    }

    return (
        <div className='w-full min-h-[85vh] py-10 bg-[#f1f1f1]'>

            <h1 className='text-4xl font-poppins font-semibold text-black text-center'>Login</h1>
            <p className='text-lg text-center font-medium py-3 text-[#00000080]'>Login to your account</p>
            <div className='w-full flex items-center justify-center'>
                <div className='md:w-[480px] bg-white shadow-md rounded-lg  '>
                    <h3 className='text-3xl font-semibold text-center mb-3'>
                        Login to Eshop
                    </h3>
                    <p className='text-center text-gray-500 mb-5'>
                        Dont have an account?{" "}
                        <Link href={"/signup"} className='text-blue-400'>Sign UP</Link>
                    </p>
                    <GoogleIcon />
                    <div className='flex  items-center my-5 text-gray-400 text-sm'>
                        <div className='flex-1 border-t border-gray-300 ' />
                        <span className='px-2'>Or continue with email</span>
                        <div className='flex-1 border-t border-gray-300 ' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login