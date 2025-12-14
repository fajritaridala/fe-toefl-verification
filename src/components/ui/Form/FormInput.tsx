import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input, InputProps } from "@heroui/react";

interface FormInputProps<T extends FieldValues> extends Omit<InputProps, "name"> {
  name: Path<T>;
  control: Control<T>;
  label: string;
}

export const FormInput = <T extends FieldValues>({
  name,
  control,
  label,
  ...props
}: FormInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Input
          {...field}
          {...props}
          label={label}
          isInvalid={!!error}
          errorMessage={error?.message}
          value={field.value?.toString() ?? ""}
        />
      )}
    />
  );
};
