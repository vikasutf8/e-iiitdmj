/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
        </div>
    )
}

export default ImagePlaceHolder