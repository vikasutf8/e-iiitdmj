/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import ImagePlaceHolder from '../../../../shared/components/image-placeholder'
import { ChevronRightIcon } from 'lucide-react'
import React, { useMemo } from 'react'
// eslint-disable-next-line @nx/enforce-module-boundaries
import Input from '../../../../../../../packages/components/input'
import { Controller, useForm } from 'react-hook-form'
import { ColorSelector } from 'packages/components/color-selector'
import CustomSpecification from 'packages/components/custom-specification'
import CustomProperties from 'packages/components/custom-property'
import axiosInstance from 'apps/user-ui/src/utils/axiosinstance'
import { useQuery } from '@tanstack/react-query'
import RichTextEditor from 'packages/components/rich-text-editor'
import SizeSelector from 'packages/components/size-selector'

const page = () => {
  const { register, control, watch, setValue, handleSubmit, formState: { errors } } = useForm();

  const [openImageModel, setOpenImageModel] = React.useState(false);
  const [image, setImage] = React.useState<(File | null)[]>([null]);
  const [isChanged, setIsChanged] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('products/api/v1/get-categories');
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const categories = data?.categories || [];
  const subCategoriesData = data?.subCategories || {};

  const selectedCategory = watch('category');
  const regularPrice = watch('regular_price');
  // categores should memorize for sub category
  const subCategories = useMemo(() => {
    return selectedCategory ? subCategoriesData[selectedCategory] || [] : [];
  }, [selectedCategory, subCategoriesData]);

  console.log(categories, subCategories);
  const onSubmit = (data: any) => {
    console.log('submit', data)
  }

  const handleSaveDraft = () => {
    // setIsChanged(false);
  }

  const handleImageChange = (file: File | null, index: number) => {
    const updatedImage = [...image];
    updatedImage[index] = file;

    if (index === image.length - 1 && image.length < 8) {
      updatedImage.push(null);
    }

    setImage(updatedImage);
    setValue("images", updatedImage);
  }

  const handleImageRemove = (index: number) => {
    setImage((prevImage) => {
      const updatedImage = [...prevImage];

      if (updatedImage.length === -1) {
        updatedImage[0] = null;
      } else {
        updatedImage.splice(index, 1);
      }

      if (updatedImage.length < 8 && !updatedImage.includes(null)) {
        updatedImage.push(null);
      }
      return updatedImage;
    })
    setValue("images", image);
  }

  return (
    <form action="" className='w-full mx-auto p-8 shadow-lg rounded-xl text-white'
      onAbort={handleSubmit(onSubmit)}>

      {/* heading and Breadcrumbs */}
      <h2 className='text-2xl font-bold font-mono text-white'>
        Create Product

      </h2>
      <div className='flex items-center gap-1'>
        <span className='text-[#8oDeea] cursor-pointer'>Dashboard</span>
        <ChevronRightIcon size={20} className='opacity-[.8]' />
        <span>Create Product</span>
      </div>
      {/* content layout */}
      <div className='py-4 w-full  flex gap-4'>
        {/* left side -image */}
        <div className='md:w-[35%]'>
          {
            image.length > 0 && (<ImagePlaceHolder
              size='765 X 858'
              small={false}
              index={0}
              defaultImage={null}
              setOpenImageModel={setOpenImageModel}
              onImageChange={handleImageChange}
              onRemove={handleImageRemove}
            />)
          }
          <div className='grid grid-cols-2 gap-4 mt-4'>
            {image.splice(1).map((image, index) => (
              <ImagePlaceHolder
                size='765 X 858'
                small={true}
                key={index}
                index={index + 1}
                defaultImage={null}
                setOpenImageModel={setOpenImageModel}
                onImageChange={handleImageChange}
                onRemove={handleImageRemove}
              />
            ))}
          </div>
        </div>

        {/* right side -form */}
        <div className='md:w-[65%]'>
          <div className='w-full flex gap-6'>
            {/* product name */}
            <div className='w-1/2'>
              {/* product name */}
              <Input label='Product Title' type='text' placeholder='Product Title' className='w-full' {...register('title', { required: "Title is required" })} />
              {errors.title && <p className='text-red-500 text-xs'>{errors.title.message as string}</p>}
              {/* product description */}
              <div className='mt-2'>
                <Input rows={7} cols={10} label='Product Description (Max 250 characters)' type='textarea' placeholder='Product Description' className='w-full' {...register('description ', {
                  required: "Description is required",
                  validate: (value) => {
                    const wordCount = value.trim().split(" ").length;
                    return wordCount <= 250 ? true : `Description is too long (${wordCount} characters)`;
                  }
                })} />
                {errors.description && <p className='text-red-500 text-xs'>{errors.description.message as string}</p>}
              </div>

              {/* product tags */}

              <div className='mt-2'>
                <Input label='Tags' type='text' placeholder='appple,game' className='w-full'
                  {...register('tags', { required: "Tags are comma separated" })} />
                {errors.tags && <p className='text-red-500 text-xs'>{errors.tags.message as string}</p>}

              </div>
              {/* product Warranty */}
              <div className='mt-2'>
                <Input label='Warranty' type='text' placeholder='1 year/No Warrenty' className='w-full' {...register('warranty', { required: "Warranty is required" })} />
                {errors.warranty && <p className='text-red-500 text-xs'>{errors.warranty.message as string}</p>}
              </div>
              {/* product slug with validation */}
              <div className='mt-2'>
                <Input label='Slug' type='text' placeholder='Slug' className='w-full' {...register('slug', {
                  required: "Slug is required", pattern: {
                    value: /^[a-zA-Z0-9-_]+$/,
                    message: "Slug can only contain letters, numbers, hyphens, and underscores"
                  }, minLength: {
                    value: 3,
                    message: "Slug must be at least 3 characters long"
                  }, maxLength: {
                    value: 50,
                    message: "Slug must be at most 50 characters long"
                  },
                  validate: (value) => {
                    const wordCount = value.trim().split("-").length;
                    return wordCount <= 50 ? true : `Slug is too long (${wordCount} characters)`;
                  }
                })} />
                {errors.slug && <p className='text-red-500 text-xs'>{errors.slug.message as string}</p>}
              </div>

              {/* brand */}
              <div className='mt-2'>
                {/* product name */}
                <Input label='Brand' type='text' placeholder='Apple' className='w-full' {...register('brand', { required: "Brand is required" })} />
                {errors.brand && <p className='text-red-500 text-xs'>{errors.brand.message as string}</p>}
              </div>
              <div className='mt-2'>
                {/* colorSelector */}
                <ColorSelector
                  label='Color'
                  control={control}
                  errors={errors} />
              </div>

              <div className='mt-2'>
                {/* custom specification */}
                <CustomSpecification
                  control={control}
                  errors={errors} />
              </div>

              <div className='mt-2'>
                {/* custom properties */}
                <CustomProperties
                  control={control}
                  errors={errors} />
              </div>

              <div className='mt-2'>
                {/* Cash on Delivery */}
                <label htmlFor="" className='block text-gray-300 font-semibold mb-1'>Cash on Delivery</label>
                <select {...register('cash_on_delivery', { required: "Cash on Delivery is required" })}
                  className='w-full outline-none border-gray-700 bg-transparent rounded-md border px-4 py-2 text-white'
                  defaultValue="yes"
                >
                  <option className='bg-black text-white' value="yes">Yes</option>
                  <option className='bg-black text-white' value="no">No</option>
                </select>
                {errors.cash_on_delivery && <p className='text-red-500 text-xs'>{errors.cash_on_delivery.message as string}</p>}
              </div>

            </div>

            {/*  */}
            <div className='w-1/2'>
              <label htmlFor="" className='block text-gray-300 font-semibold mb-1'>Category *</label>

              {isLoading ? (
                <p className='text-gray-500 text-xs'>Loading...</p>
              ) : isError ? (
                <p className='text-red-500 text-xs'>Failed to load categories</p>
              ) : (
                <Controller
                  name="category"
                  control={control}
                  rules={{
                    required: "Category is required",
                  }}
                  render={({ field }) => (
                    <select {...field} className='w-full outline-none border-gray-700 bg-transparent rounded-md border px-4 py-2 text-white'
                      defaultValue=""
                    >
                      <option className='bg-black text-white' value="">Select Category</option>
                      {categories.map((category: string) => (
                        <option key={category} className='bg-black text-white' value={category}>{category}</option>
                      ))}
                    </select>
                  )}
                />
              )}
              {errors.category && <p className='text-red-500 text-xs'>{errors.category.message as string}</p>}


              <div className='mt-2'>
                <label htmlFor="" className='block text-gray-300 font-semibold mb-1'>Sub Category *</label>
                {isLoading ? (
                  <p className='text-gray-500 text-xs'>Loading...</p>
                )
                  : isError ? (
                    <p className='text-red-500 text-xs'>Failed to load sub categories</p>
                  ) : (
                    <Controller
                      name="sub_category"
                      control={control}
                      rules={{
                        required: "Sub Category is required",
                      }}
                      render={({ field }) => (
                        <select {...field} className='w-full outline-none border-gray-700 bg-transparent rounded-md border px-4 py-2 text-white'
                          defaultValue=""
                        >
                          <option className='bg-black text-white' value="">Select Sub Category</option>
                          {subCategories.map((subCategory: string) => (
                            <option key={subCategory} className='bg-black text-white' value={subCategory}>{subCategory}</option>
                          ))}
                        </select>
                      )}
                    />
                  )}

                {errors.sub_category && <p className='text-red-500 text-xs'>{errors.sub_category.message as string}</p>}
              </div>

              <div className='mt-2'>
                <label htmlFor="" className='block text-gray-300 font-semibold mb-1'>Detailed Description *(Min 50 Max 350 characters)</label>
                <Controller
                  name="detailed_description"
                  control={control}
                  rules={{
                    required: "Detailed Description is required",
                    maxLength: {
                      value: 250,
                      message: "Detailed Description is too long (Max 350 characters)",
                    },
                    validate: (value) => {
                      const wordCount = value.trim().split(" ").length;
                      return wordCount >= 50 && wordCount <= 350 ? true : `Detailed Description is too long ( 50-350 characters)`;
                    }
                  }}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Write something meaningful..."
                    />
                  )}
                />
                {errors.detailed_description && <p className='text-red-500 text-xs'>{errors.detailed_description.message as string}</p>}
              </div>

              <div className='mt-2'>
                <Input
                  label="Video URL"
                  placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  {
                  ...register('video_url', {
                    required: "Video URL is required",
                    pattern: {
                      value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/,
                      message: "Video URL is invalid (https://www.youtube.com/embed/dQw4w9WgXcQ)",
                    },
                  })
                  }
                />
                {errors.video_url && <p className='text-red-500 text-xs'>{errors.video_url.message as string}</p>}
              </div>


              <div className='mt-2'>
                <Input
                  label="Regular Price"
                  placeholder="Regular Price"
                  {
                  ...register('regular_price', {
                    required: "Regular Price is required",
                    pattern: {
                      value: /^[0-9]+(\.[0-9]{1,2})?$/,
                      message: "Regular Price is invalid",
                    },
                  })
                  }
                />
                {errors.regular_price && <p className='text-red-500 text-xs'>{errors.regular_price.message as string}</p>}
              </div>

              {/* sales price should less than regular price */}
              <div className='mt-2'>
                <Input
                  label="Sales Price"
                  placeholder="Sales Price"
                  {
                  ...register('sales_price', {
                    required: "Sales Price is required",
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Sales Price should be greater than 0",
                    },
                    validate: (value) => {
                      const regularPrice = watch('regular_price');
                      if (regularPrice && value && regularPrice > value) {
                        return "Sales Price should be less than Regular Price";
                      }
                      if (isNaN(value)) {
                        return "Sales Price should be a number";
                      }
                      return true;
                    },

                  })
                  }
                />
                {errors.sales_price && <p className='text-red-500 text-xs'>{errors.sales_price.message as string}</p>}
              </div>

              {/* Stock */}
              <div className='mt-2'>
                <Input
                  label="Stock Quantity"
                  placeholder="Stock Quantity"
                  {
                  ...register('stock', {
                    required: "Stock Quantity is required",
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Stock Quantity should be greater than 0",
                    },
                    max: {
                      value: 1000,
                      message: "Stock Quantity should be less than 1000",
                    },
                    validate: (value) => {
                      if (isNaN(value)) {
                        return "Stock Quantity should be a number";
                      }
                      if(!Number.isInteger(value)){
                        return "Stock Quantity should be an integer";
                      }
                      return true;
                    }
                  })
                  }
                  />
                  {errors.stock && <p className='text-red-500 text-xs'>{errors.stock_quantity.message as string}</p>}
              </div>

              <div className='mt-2'>
                <SizeSelector control={control} errors={errors} />
              </div>

              {/* selecting discount codes */}
              <div className='mt-4'>
                  <label htmlFor="" className='block text-gray-300 font-semibold mb-1'>Discount Codes(Optional)</label>
              </div>


            </div>

        

          </div>
        </div>

      </div>

          <div className='mt-6 flex justify-end gap-3'>
                  {
                    isChanged && (
                      <button
                        type='button'
                        onClick={handleSaveDraft}
                        className='px-4 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition'
                      >
                        Save Draft
                      </button>
                    )
                  }
                  <button
                        type='button'
                        onClick={handleSaveDraft}
                        className='px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition'
                      >
                        Create Product
                      </button>
            </div>
    </form>
  )
}

export default page