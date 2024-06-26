import * as z from 'zod';

import { AUTH_FORM_SCHEMA } from '@/zod-schemas/index.';
import { UseFormReturn } from 'react-hook-form';
import SSNInput from '../_common/SSNInput';
import { DatePicker } from '../_common/DatePicker';
import ZodFormFieldInput from './ZodAuthFormFieldInput';

const formSchema = AUTH_FORM_SCHEMA('sign-up');

interface SignUpFormFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export default function SignUpFormFields({ form }: SignUpFormFieldsProps) {
  return (
    <>
      <div className='flex gap-4'>
        {/* first name */}
        <ZodFormFieldInput
          control={form.control}
          label='First Name'
          name='firstName'
          placeholder='John'
        />
        {/* last name */}
        <ZodFormFieldInput
          control={form.control}
          label='Last Name'
          name='lastName'
          placeholder='Doe'
        />
      </div>
      {/* address */}
      <ZodFormFieldInput
        control={form.control}
        label='Address'
        name='address1'
        placeholder='123 Trade Street'
      />

      {/* city */}
      <ZodFormFieldInput
        control={form.control}
        label='City'
        name='city'
        placeholder='Seattle'
      />

      <div className='flex gap-4'>
        {/* state */}
        <ZodFormFieldInput
          control={form.control}
          label='State'
          name='state'
          placeholder='WA'
        />
        {/* postal code */}
        <ZodFormFieldInput
          control={form.control}
          label='Postal Code'
          name='postalCode'
          placeholder='12345'
        />
      </div>

      <div className='flex gap-4'>
        {/* date of birth */}
        <DatePicker
          control={form.control}
          label='Date of Birth'
          name='dateOfBirth'
        />
        {/* SSN */}
        <SSNInput form={form} />
      </div>
    </>
  );
}
