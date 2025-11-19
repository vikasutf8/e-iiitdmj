// index.tsx or ColorSelector.tsx

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Controller } from "react-hook-form";

const defaultColors = [
    "#000000", // Black
    "#ffffff", // White
    "#ff0000", // Red
    "#00ff00", // Green
    "#0000ff", // Blue
    "#ffff00", // Yellow
    "#ff00ff", // Magenta
    "#00ffff", // Cyan
];


export const ColorSelector = ({ control, errors }: any) => {

    const [customColor, setCustomColor] = useState<string[]>([]);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [newColor, setNewColor] = useState("#ffffff");


    return (
        <div className="mt-2 ">
            {defaultColors.map((color) => (
                <label key={color} className="block text-gray-300 mb-1">
                    <Controller
                        name="colors"
                        control={control}
                        defaultValue={color}
                        render={({ field }) => (
                            <div className="flex flex-wrap gap-2">
                                {[...defaultColors, ...customColor].map((color) => {
                                    const isSelected = (field.value || []).includes(color);
                                    const isLightColor = [
                                        "#ffffff",
                                        "#ffff00",
                                    ].includes(color);

                                    return (
                                        <button type="button" key={color}
                                            onClick={() => {
                                                const selected = field.value || [];
                                                field.onChange(
                                                    isSelected
                                                        ? selected.filter((c: string) => c !== color)
                                                        : [...selected, color]
                                                );
                                            }}
                                            className={`w-7 h-7 rounded-md my-1 flex items-center cursor-pointer justify-center border-2 transition ${isSelected ?"scale-100 border-white": "border-transparent"} 
                                                ${isLightColor ? "border-gray-600" : ""}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    )
                                })}

                                {/* Add new color */}
                                <button type="button" 
                                className="w-8 h-8 flex items-center justify-self-center rounded-full border-2 border-gray-500 cursor-pointer bg-slate-700 hover:bg-slate-600 transition"
                                >
                                    <PlusIcon size={16} className="text-white" />
                                </button>


                                {/* color picker */}
                               {
                                showColorPicker && (
                                     <div className="relative flex items-center gap-2">
                                    <input
                                    type="color"
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                    className="w-10 h-10 p-0 rounded-md border-nono border-gray-500 bg-slate-700 text-white cursor-pointer"
                                    />
                                    <button type="button"
                                    className="px-3 py-1 bg-gray-500 rounded-md text-white text-sm"
                                    onClick={() => {
                                        setCustomColor([...customColor, newColor]);
                                        setShowColorPicker(false);
                                    }}
                                    >
                                        Add
                                    </button>
                                </div>
                                )
                               }
                               
                            </div>
                        )}
                    />
                </label>
            ))}

            {errors?.selectedColor && (
                <p className="text-red-500 text-sm mt-1">
                    {errors.selectedColor.message}
                </p>
            )}
        </div>
    );
};
