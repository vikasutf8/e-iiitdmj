import { name } from 'ejs';
import { PlusCircle, TrashIcon } from 'lucide-react';
import React from 'react'
import { Controller, useFieldArray } from 'react-hook-form';

const CustomSpecification = ({control, errors}: any) => {

const { fields, append, remove } = useFieldArray({
    control,
    name: "",
  });


  return (
    <div>
        <label htmlFor=""
        className="block text-gray-300 font-semibold mb-1">
            Custom Specification
        </label>
        <div>
            <div className="flex flex-wrap flex-col gap-2">
                {fields.map((item:any, index:any):any => (
                    <div key={index} className="flex items-center gap-2">
                       <Controller
                        name={`custom_specification.${index}.name`}
                        control={control}
                        rules={{required: "Specification name is required"}}
                        render={({ field }) => (
                            <input
                                aria-label="Specification Name"
                                placeholder="e.g. Size, Color, Material, Weight"
                                className="w-full"
                                {...field}
                           
                            />
                        )}
                    />
                    <Controller
                        name={`custom_specification.${index}.value`}
                        control={control}
                        rules={{required: "Value is required"}}
                        render={({ field }) => (
                            <input
                                aria-label="Specification Value"
                                placeholder="e.g. S, Red, Cotton, 10kg"
                                className="w-full"
                                {...field}
                            />
                        )}
                    />
                    <button type='button' onClick={() => remove(index)} className='text-red-500 hover:text-red-700'>
                        <TrashIcon size={16} className='text-white' />

                    </button>
                    </div>
                ))}
                <button type="button" onClick={() => append({name:"",value:""})} className='bg-blue-400 hover:bg-blue-600 text-white px-2 py-1 rounded-md flex items-center gap-2'>
                    <PlusCircle size={16} className='text-white' />
                    Add Specification
                </button>
            </div>
            {errors.custom_specification && (
                <p className="text-red-500 text-sm">
                    {errors.custom_specification.message as string}
                </p>
            )}
        </div>
    </div>
  )
}

export default CustomSpecification