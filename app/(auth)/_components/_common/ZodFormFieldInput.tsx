import { useState } from 'react';
import { FormField, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import ShowPasswordButton from '../_authform/AuthFormShowPasswordButton';
import * as z from 'zod';
import { FieldPath, Control } from 'react-hook-form';
import { AUTH_FORM_SCHEMA } from '@/zod-schemas/index.';

const formSchema = AUTH_FORM_SCHEMA('sign-up');

interface FormInputProps {
  label?: string;
  placeholder?: string;
  name: FieldPath<z.infer<typeof formSchema>>;
  control: Control<z.infer<typeof formSchema>>;
  obscure?: boolean;
}

export default function ZodFormFieldInput({
  label,
  placeholder,
  name,
  control,
  obscure = false,
}: FormInputProps) {
  const [isVisable, setIsVisable] = useState(obscure);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className='form-item'>
          <FormLabel className='form-label'>{label}</FormLabel>
          <div className='flex w-full flex-col'>
            <FormControl>
              <div className='relative'>
                <Input
                  type={isVisable ? 'password' : 'text'}
                  placeholder={placeholder}
                  className='input-class'
                  {...field}
                />
                {obscure && (
                  <ShowPasswordButton
                    setIsVisable={setIsVisable}
                    isVisable={isVisable}
                  />
                )}
              </div>
            </FormControl>
            <FormMessage className='form-message' />
          </div>
        </div>
      )}
    />
  );
}
