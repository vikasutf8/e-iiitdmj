import React, { forwardRef } from 'react'
type BaseProps = {
  label?: string;
  type?: "text" | "textarea" | "email" | "password" | "number";
  className?: string;
};

type TextareaProps = BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>;
type InputProps = BaseProps & React.InputHTMLAttributes<HTMLInputElement>;
type Props = InputProps | TextareaProps;


const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
  ({ label, type = 'text', className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className='block font-semibold text-gray-300 mb-1 '>{label}</label>}
        {type === 'textarea' ? (
          <textarea
            className={`w-full outline-none  border-gray-700 bg-transparent rounded-md border text-white px-4 py-2 ${className}`}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            {...props as TextareaProps}
          />
        ):(
            <input 
              type={type}
            className={`w-full outline-none  border-gray-700 bg-transparent rounded-md border px-4 py-2 text-white ${className}`}
            ref={ref as React.Ref<HTMLInputElement>}
            {...props as InputProps}
            />
        )
        }
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input