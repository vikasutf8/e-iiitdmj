import { useMutation } from '@tanstack/react-query';
import { categories } from '../../../utils/categories'
import axios from 'axios';
import React from 'react'
import { useForm } from 'react-hook-form'

const CreateShop = (
    {
        sellerId,
        setActiveStep,
    }:{
        sellerId:string,
        setActiveStep: (step : number) => void
    }
) => {

const  { register, handleSubmit, formState: { errors } } = useForm();
const countWords = (str: string) => {
    return str.trim().split(/\s+/).length;
};
const shopCreateMutation = useMutation({
    mutationFn: async (data: FormData) => {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/create-shop`, data);
        return response.data;
        // return true;

    },
    onSuccess: (data:any) => {
        console.log(data, "this is data");
        setActiveStep(3);
    },
});

const onSubmit = async (data: any) => {
    const shopData= {...data,sellerId};
    shopCreateMutation.mutate(shopData);
}

  return (
    <div>
        <form action="" onSubmit={handleSubmit(onSubmit)}>
            <h3 className='text-2xl font-bold flex justify-center'>SetUp Shop</h3>
            <label className='block text-sm font-medium text-gray-700 mt-3'>Name</label>
            <input type="text" className='w-full p-2 border border-gray-300 !rounded outline-0'
                placeholder="Shop Name"
                {...register('name', {
                    required: 'Shop Name is required',
                }
                )}
            />
            {
                errors.name &&
                <p className='text-red-500 text-sm'>
                    {String(errors.name?.message)}
                </p>
            }

             <label className='block text-sm font-medium text-gray-700 mt-3'>Bio**(max 100 words)</label>
            <input type="text" className='w-full p-2 border border-gray-300 !rounded outline-0'
                placeholder="Shop Bio"
                {...register('bio', {
                    required: 'Shop Bio is required',
                    validate: (value) => countWords(value) <=100 || 'Bio should be less than 100 words'  
                })}
            />
            {
                errors.bio &&
                <p className='text-red-500 text-sm'>
                    {String(errors.bio?.message)}
                </p>
            }
            {/* address */}
            <label className='block text-sm font-medium text-gray-700 mt-3'>Address</label>
            <input type="text" className='w-full p-2 border border-gray-300 !rounded outline-0'
                placeholder="Shop Address"
                {...register('address', {
                    required: 'Shop Address is required',
                })}
            />
            {
                errors.address &&
                <p className='text-red-500 text-sm'>
                    {String(errors.address?.message)}
                </p>
            }

            {/* opening_hours */}
            <label className='block text-sm font-medium text-gray-700 mt-3'>Opening Hours</label>
            <input type="text" className='w-full p-2 border border-gray-300 !rounded outline-0'
                placeholder="eg: Mon-Fri 10am-8pm"
                {...register('opening_hours', {
                    required: 'Shop Opening Hours is required',
                })}
            />
            {
                errors.opening_hours &&
                <p className='text-red-500 text-sm'>
                    {String(errors.opening_hours?.message)}
                </p>
            }

            {/* website */}

            <label className='block text-sm font-medium text-gray-700 mt-3'>Website(Otpional)</label>
            <input type="text" className='w-full p-2 border border-gray-300 !rounded outline-0'
                placeholder="Shop Website"
                {...register('website', {
                    validate: (value) => /^https?:\/\//.test(value) || 'Website must start with http:// or https://'
                })}
            />
            {
                errors.website &&
                <p className='text-red-500 text-sm'>
                    {String(errors.website?.message)}
                </p>
            }

            {/* category */}
            <label className='block text-sm font-medium text-gray-700 mt-3'>Category</label>
            <select
                className='w-full p-2 border border-gray-300 !rounded outline-0'
                {...register('category', {
                    required: 'Shop Category is required',
                })}
            >
                <option value="">Select your Category</option>
                {categories.map((category) => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                ))}
            </select>
            {
                errors.category &&
                <p className='text-red-500 text-sm'>
                    {String(errors.category?.message)}
                </p>
            }

            <button type='submit' className='mt-4 w-full text-xl font-bold cursor-pointer bg-[#000000d6] active:bg-black text-white py-2 rounded-lg'>
                Create
            </button>
        </form> 
    </div>
  )
}

export default CreateShop