import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Select, SelectItem, SelectProps } from '@heroui/react';

interface Option {
  label: string;
  value: string | number;
}

interface FormSelectProps<T extends FieldValues>
  extends Omit<SelectProps, 'name' | 'children'> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: Option[];
}

export const FormSelect = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  ...props
}: FormSelectProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Select
          {...field}
          {...props}
          label={label}
          selectedKeys={field.value ? [field.value.toString()] : []}
          isInvalid={!!error}
          errorMessage={error?.message}
          color={error ? 'danger' : 'default'}
          validationBehavior="aria"
        >
          {options.map((option) => (
            <SelectItem key={option.value}>{option.label}</SelectItem>
          ))}
        </Select>
      )}
    />
  );
};
