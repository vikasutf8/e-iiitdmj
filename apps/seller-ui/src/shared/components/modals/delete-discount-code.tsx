import { CheckIcon, DeleteIcon, XIcon } from 'lucide-react'
import React from 'react'

const DeleteDiscountCodeModal = ({ onClose, onConfirm, discountCode }: { onClose: () => void, onConfirm?: () => void, discountCode: any }) => {
    return (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center'>
            <div className='bg-gray-800 p-6 rounded-xl shadow-lg w-[500px]'>
                {/* Heading */}
                <div className='flex justify-between items-center border-b border-gray-700 pb-3' >
                    <h3 className='text-xl font-bold font-mono text-white'>Delete Discount Code</h3>
                    <button className='text-white cursor-pointer' onClick={onClose}>
                       <XIcon size={18} />
                    </button>
                </div>

{/* Warning */}
                <div className='mt-4 text-white'>
                    <p className='text-sm'>Are you sure you want to delete this discount code?
                    <span className='text-sm font-bold'>{discountCode.public_name}</span>
                    <br />
                    This action cannot be undone**
                    </p>
                    {/* Buttons */}
                    <div className='mt-4 flex justify-end gap-3'>
                        <button
                            className='px-4 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition w-full flex items-center justify-center gap-3'
                            onClick={onClose}
                        >
                            <XIcon size={18} />
                            Cancel
                        </button>
                        <button
                            className='px-4 py-2 bg-red-400 text-white rounded-lg font-semibold hover:bg-red-500 transition w-full flex items-center justify-center gap-3'
                            onClick={onConfirm}
                        >
                            <DeleteIcon size={18} />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteDiscountCodeModal