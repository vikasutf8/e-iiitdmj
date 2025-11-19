/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import ImagePlaceHolder from '../../../../shared/components/image-placeholder'
import { ChevronRightIcon } from 'lucide-react'
import React from 'react'
import Input from '../../../../../../../packages/components/input'
import { useForm } from 'react-hook-form'
import { ColorSelector } from 'packages/components/color-selector'

const page = () => {
  const { register, control, watch, setValue, handleSubmit, formState: { errors } } = useForm();

  const [openImageModel, setOpenImageModel] = React.useState(false);
  const [image, setImage] = React.useState<(File | null)[]>([null]);
  const [isChanged, setIsChanged] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const onSubmit = (data: any) => {
    console.log('submit', data)
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
                  errors={errors}
                  
                />
              </div>

            </div>
          </div>
        </div>

        </div>
    </form>
  )
}

export default page