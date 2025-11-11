'use client'

import ImagePlaceHolder from '../../../../shared/components/image-placeholder'
import { ChevronRightIcon } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'

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

   if(index === image.length-1 && image.length < 8){
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
      }else{
        updatedImage.splice(index, 1);
      }

      if(updatedImage.length <8  && !updatedImage.includes(null)){
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
        <div className='w-[35%]'>
           <ImagePlaceHolder 
           size='765 X 858' 
           small={false} 
           index={0}
           defaultImage={null}
            setOpenImageModel={setOpenImageModel}
            onImageChange={handleImageChange}
            onRemove={handleImageRemove}
           />
        </div>
        {/* right side -form */}
        <div className='w-[65%]'>
          
        </div>
      </div>
    </form>

  )
}

export default page