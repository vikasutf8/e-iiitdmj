"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DeleteDiscountCodeModal from 'apps/seller-ui/src/shared/components/modals/delete-discount-code';
import axiosInstance from 'apps/seller-ui/src/utils/axiosinstance';
import { AxiosError } from 'axios';
import { ChevronRightIcon, PlugIcon, TrashIcon, XIcon } from 'lucide-react'
import Link from 'next/link';
import Input from 'packages/components/input';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';

const Page = () => {

  const [showModal, setShowModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false); 
  const [selectDiscountCode, setSelectDiscountCode] = React.useState<any>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      public_name: '',
      discountType: 'percentage',
      discountValue: "",
      discountCode: '',
    }
  });

  const { data: discountCodes = [], isLoading } = useQuery({
    queryKey: ['shop-discounts'],
    queryFn: async () => {
      const response = await axiosInstance.get("products/api/v1/get-discount-code");
      return response.data?.discount_codes || [];
    },
    // staleTime: 1000 * 60 * 5,
    // retry: 2,

  })

  const createDiscountCodeMutation = useMutation({
    // mutationKey: ['create-discount-code'],
    mutationFn: async (data: any) => {
      await axiosInstance.post("products/api/v1/create-discount-code", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-discounts'] });
      reset();
      setShowModal(false);
    },
  })

  const deleteDiscountCodeMutation = useMutation({
    // mutationKey: ['delete-discount-code'],
    mutationFn: async (discountId: string) => {
      await axiosInstance.delete(`products/api/v1/delete-discount-code/${discountId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-discounts'] });
      setShowDeleteModal(false);
    },
  })

  const handleDeleteClick = async (discountCode: any) => {
    // console.log(discountCode, "discountCode")
    // toast.error("You can only create one discount code");
    setSelectDiscountCode(discountCode);
    setShowDeleteModal(true);
  }

  const onSubmit = (data: FormData) => {
    if (discountCodes.length >= 8) {
      // toast.error("You can only create one discount code");
      return;
    }
    createDiscountCodeMutation.mutate(data);
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
          isLoading ? (
            <p className='text-gray-500 text-xs text-center'>Discount Codes Loading...</p>
          ) : (
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
                  discountCodes.map((discountCode: any) => (
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


      {/* Create Discount Code Modal */}
      {
        showModal && (
          <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center'>
            <div className='bg-gray-800 p-6 rounded-xl shadow-lg w-[500px]'>
              <div className='flex justify-between items-center border-b border-gray-700 pb-3' >
                <h3 className='text-xl font-bold font-mono text-white'>Create Discount Code</h3>
                <button className='text-white cursor-pointer' onClick={() => setShowModal(false)}>
                  <XIcon size={18} />
                </button>
              </div>

              <form action=""
                onSubmit={handleSubmit(onSubmit)}
                className='mt-4'
              >
                {/* Title */}
                <Input
                  label="Title(Public Name)"

                  {...register('public_name', {
                    required: "Title is required",
                  })}
                  placeholder="Title"
                  className='w-full'
                />
                {errors.public_name && <p className='text-red-500 text-xs'>{errors.public_name.message as string}</p>}
                {/* Type */}
                <div className='mt-2'>
                  <label htmlFor="" className='block text-gray-300 font-semibold mb-1'>Discount Type *</label>
                  <Controller
                    name="discountType"
                    control={control}
                    rules={{
                      required: "Discount Type is required",
                    }}
                    render={({ field }) => (
                      <select {...field} className='w-full outline-none border-gray-700 bg-transparent rounded-md border px-4 py-2 text-white'
                        defaultValue=""
                      >
                        <option className='bg-black text-white' value="percentage">Percentage (%)</option>
                        <option className='bg-black text-white' value="fixed">Fixed ($)</option>
                      </select>
                    )}
                  />
                  {errors.discountType && <p className='text-red-500 text-xs'>{errors.discountType.message as string}</p>}
                </div>

                {/* Value */}
                <div className='mt-2'>
                  <Input
                    label="Discount Value"
                    {...register('discountValue', {
                      required: "Discount Value is required",
                    })}
                    placeholder="Discount Value"
                    className='w-full'
                  />
                  {errors.discountValue && <p className='text-red-500 text-xs'>{errors.discountValue.message as string}</p>}
                </div>

                {/* Code */}
                <div className='mt-2'>
                  <Input
                    label="Discount Code"
                    {...register('discountCode', {
                      required: "Discount Code is required",
                    })}
                    placeholder="Discount Code"
                    className='w-full'
                  />
                  {errors.discountCode && <p className='text-red-500 text-xs'>{errors.discountCode.message as string}</p>}
                </div>

                <button
                  disabled={createDiscountCodeMutation.isPending}
                  className='px-4 py-2 bg-blue-400 text-white rounded-lg font-semibold hover:bg-blue-500 transition w-full flex items-center justify-center gap-3'
                  type='submit'
                >
                  <PlugIcon size={18} />
                  {
                    createDiscountCodeMutation.isPending ? 'Creating...' : 'Create Discount Code'
                  }
                </button>
                {
                  createDiscountCodeMutation.isError && (
                    <p className='text-red-500 text-xs'>{(
                      createDiscountCodeMutation.error as AxiosError<{ message: string }>
                    )?.response?.data?.message || "Failed to create discount code"}</p>
                  )
                }
              </form>
            </div>
          </div>
        )
      }

      {/* Delete Discount Code Modal */}

      {
        showDeleteModal && selectDiscountCode && (
          <DeleteDiscountCodeModal
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => {
            return deleteDiscountCodeMutation.mutate(selectDiscountCode?.id); //??? Check there
            }}
            discountCode={selectDiscountCode}
          />
        )
      }

    </div>
  )
}

export default Page