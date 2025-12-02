import { Controller } from "react-hook-form";

const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];

const SizeSelector = ({ control, errors }: any) => {
  return (
    <div className="mt-2">
      <label className="block text-gray-300 font-semibold mb-1">
        Size *
      </label>

      <Controller
        name="size"
        control={control}
        rules={{
          required: "Size is required",
        }}
        render={({ field }) => {
          const value: string[] = field.value || [];

          const toggleSize = (size: string) => {
            if (value.includes(size)) {
              field.onChange(value.filter((s) => s !== size));
            } else {
              field.onChange([...value, size]);
            }
          };

          return (
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => {
                const isSelected = value.includes(size);

                return (
                  <button
                    type="button"
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 rounded-md border 
                      transition 
                      ${isSelected 
                        ? "bg-white text-black border-white" 
                        : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"}`}
                  >
                    {size}
                    {isSelected ? " ✓" : ""}
                  </button>
                );
              })}
            </div>
          );
        }}
      />

      {errors?.size && (
        <p className="text-red-400 text-sm mt-1">{errors.size.message}</p>
      )}
    </div>
  );
};

export default SizeSelector;
