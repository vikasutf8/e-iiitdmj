/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pencil, WandSparkles, WandSparklesIcon, X } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

const ImagePlaceHolder = ({
    size, small, onImageChange, onRemove, defaultImage = null, index = null, setOpenImageModel
}: {
    size: string,
    small?: boolean,
    onImageChange: (file: File | null, index: number) => void,
    onRemove?: (index: number) => void,
    defaultImage: string | null;
    index?: any,
    setOpenImageModel: (openImageModel: boolean) => void
}) => {


    const [imagePreview, setImagePreview] = React.useState<string | null>(defaultImage);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        onImageChange(file, index);
        setImagePreview(URL.createObjectURL(file));
    }
    return (
        <div className={`relative ${small ? 'h-[180px]' : 'h-[450px]'} w-full cursor-pointer bg-[#1e1e1e] rounded-lg border border-gray-600 flex flex-col items-center justify-center`}>
            <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
             className='hidden' id={`image-upload-${index}`}
               />
            {
                imagePreview ? (
                    <>
                        <button
                        type='button'
                        className='absolute top-3 right-3 p-2 !rounded shadow-lg bg-red-500 text-white'
                        onClick={() => {
                            onRemove?.(index);
                            setOpenImageModel(false);
                        }} > 
                        <X size={16}/>
                        </button>
                         <button
                        type='button'
                        className='absolute top-3 right-[70px] p-2 !rounded shadow-lg bg-blue-500 cursor-pointer text-white'
                        onClick={() => {
                         
                            setOpenImageModel(true);
                        }} > 
                        <WandSparkles size={16}/>
                        </button>
                    </>
                ):(
                    <label
                    className='absolute top-3 right-3 p-2 !rounded shadow-lg bg-slate-700 cursor-pointer text-white'
                    htmlFor={`image-upload-${index}`}
                    >
                        <Pencil size={16}/>
                    </label>
                )
            }

            {
                imagePreview ? (
                    <Image
                    width={small ? 200 : 400}
                    height={small ? 200 : 400}
                    src={imagePreview}
                    alt='product image'
                    className='w-full h-full object-cover rounded-lg'
                    />
                ):(
                    <>
                    <p
                    className={`font-semibold text-gray-400 
                        ${small ? 'text-xl' : 'text-4xl'}`}
                    >{size}</p>
                    <p className={`text-gray-500 ${small ? 'text-sm': 'text-lg'} pt-2 text-center`}>
                        Please choose an image according to the expected ratio.
                    </p>
                    </>
                )
            }
        </div>
    )
}

export default ImagePlaceHolder