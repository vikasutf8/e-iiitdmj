"use client"

import { useQuery } from '@tanstack/react-query';
import axiosInstance from 'apps/seller-ui/src/utils/axiosinstance';
import { ChevronRightIcon, PlugIcon, TrashIcon } from 'lucide-react'
import Link from 'next/link';
import React from 'react'

const Page = () => {

  const [showModal, setShowModal] = React.useState(false);

  const {data:discountCodes=[], isLoading} = useQuery({
    queryKey: ['shop-discounts'],
    queryFn: async() => {
      const response =await axiosInstance.get("products/api/v1/get-discount-code");
      return response.data?.discount_codes || [];
    },
    // staleTime: 1000 * 60 * 5,
    // retry: 2,
    
  })

  const handleDeleteClick = async(discountCode:any)=>{
    console.log(discountCode,"discountCode");
  }

  return (
    <div className='w-full min-h-screen p-8'>
      <div className='flex justify-between items-center mb-1'>
        <h2 className='text-2xl font-bold font-mono text-white'>
          Discount Codes
        </h2>
        <button className='bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition px-4 py-2 flex items-center gap-2'
        onClick={() => setShowModal(true)}
        > 
          <PlugIcon size={18} />
          Create Discount 
        </button>
      </div>
      {/* breadCrumbs */}
      <div className='flex items-center gap-1 text-white'>
        <Link href={'/dashboard'} className='text-[#8oDeea] cursor-pointer'>Dashboard</Link>
        <ChevronRightIcon size={20} className='opacity-[.8]' />
        <span>Discount Codes</span>
      </div>

      {/* list of existing discount codes */}
      <div className='mt-8 p-6 bg-gray-800 rounded-xl shadow-md'>
        <h3 className='text-xl font-bold font-mono text-white mb-4'>
          Your Discount Codes
        </h3>
        {
          isLoading ?(
            <p className='text-gray-500 text-xs text-center'>Discount Codes Loading...</p>
          ):(
            <table className='w-full text-white'>
              <thead >
                <tr className='border-b border-gray-700'>
                  <th scope='col' className='px-6 py-3 text-left'>Title</th>
                  <th scope='col' className='px-6 py-3 text-left'>Type</th>
                  <th scope='col' className='px-6 py-3 text-left'>Value</th>
                  <th scope='col' className='px-6 py-3 text-left'>Code</th>
                  <th scope='col' className='px-6 py-3 text-left'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  discountCodes.map((discountCode:any)=>(
                    <tr key={discountCode?.id} className='border-b border-gray-800 hover:bg-gray-700 transition'>
                      <td className='px-6 py-3 text-left'>{discountCode?.public_name}</td>
                      <td className='px-6 py-3 text-left'>{discountCode?.discountType === "percentage" ? "Percentage (%)" : "Fixed ($)"}</td>
                      <td className='px-6 py-3 text-left'>{discountCode?.discountType === "percentage" ? 
                      `${discountCode?.discountValue}%` : `$${discountCode?.discountValue}`}</td>
                      <td className='px-6 py-3 text-left'>{discountCode?.discountCode}</td>
                      <td className='px-6 py-3 text-left'>
                        <button className='bg-red-400 text-white rounded-lg hover:bg-red-500 transition '
                        onClick={() => handleDeleteClick(discountCode)}
                        > 
                          <TrashIcon size={18} />
                          Edit 
                        </button>
                      </td>
                    </tr>
                  ))
                }
               
              </tbody>
               {
                  !isLoading && discountCodes.length === 0 && (
                    <p className='text-gray-400 text-xs p-5 text-center'>You have no discount codes</p>
                  )
                }
            </table>
          )
        }

      </div>

    </div>
  )
}

export default Page