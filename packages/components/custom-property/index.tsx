import { name } from 'ejs';
import { Plus, PlusCircle, TrashIcon, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray } from 'react-hook-form';

const CustomProperties = ({ control, errors }: any) => {
   const [properties, setProperties] = useState<
  { label: string; values: string[] }[]
>([]);
    const [newLabel, setNewLabel] = React.useState("");
    const [newValue, setNewValue] = React.useState("");



   return (
  <div>
    <Controller
      name="custom_properties"
      control={control}
      render={({ field }) => {
        useEffect(() => {
          field.onChange(properties);
        }, [properties]);

        const addProperty = () => {
          if (!newLabel.trim()) return;

          setProperties([...properties, { label: newLabel, values: [] }]);
          setNewLabel("");
        };

        const addValue = (index: number) => {
          if (!newValue.trim()) return;

          const updated = [...properties];
          updated[index].values.push(newValue);
          setProperties(updated);
          setNewValue("");
        };

        const removeProperty = (index: number) => {
          setProperties(properties.filter((_, i) => i !== index));
        };

        return (
          <div className="mt-2">
            <label className="block text-gray-300 font-semibold mb-1">
              Custom Properties
            </label>

            <div className="flex flex-wrap flex-col gap-3">
              {/* existing properties */}
              {properties.map((item: any, index: number) => (
                <div
                  key={index}
                  className="border-gray-700 p-3 rounded-lg bg-gray-900"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">{item.label}</span>

                    <button
                      type="button"
                      onClick={() => removeProperty(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} className="text-red-500" />
                    </button>
                  </div>

                  {/* Add value */}
                  <div className="flex items-center mt-2 gap-2">
                    <input
                      aria-label="Specification Value"
                      placeholder="e.g. S, Red, Cotton, 10kg"
                      className="outline-none w-full border-green-700 bg-gray-800 p-2 rounded-md text-white"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                    />

                    <button
                      type="button"
                      onClick={() => addValue(index)}
                      className="bg-blue-400 hover:bg-blue-600 text-white px-2 py-1 rounded-md flex items-center gap-2"
                    >
                      <PlusCircle size={16} className="text-white" />
                      Add Value
                    </button>
                  </div>

                  {/* Show values */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.values.map((value: any, i: number) => (
                      <span
                        key={i}
                        className="bg-gray-500 text-white px-2 py-1 rounded-md"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {/* Add new property */}
              <div className="flex items-center gap-2 mt-1">

                <input
                  aria-label="Specification Label"
                  placeholder="e.g. Color, Size, Material"
                  className="outline-none w-full border-green-700 bg-gray-800 p-2 rounded-md text-white"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                />

                <button
                  type="button"
                  onClick={addProperty}
                  className="bg-blue-400 hover:bg-blue-600 text-white px-2 py-1 rounded-md flex items-center gap-2"
                >
                  <Plus size={16} className="text-white" />
                  Add
                </button>
              </div>
            </div>
          </div>
        );
      }}
    />

    {errors.custom_specification && (
      <p className="text-red-500 text-sm">
        {errors.custom_specification.message as string}
      </p>
    )}
  </div>
);

}

export default CustomProperties;