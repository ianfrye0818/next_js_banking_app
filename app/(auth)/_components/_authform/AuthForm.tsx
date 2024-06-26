'use client';
import React, { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';

import { AUTH_FORM_SCHEMA } from '@/zod-schemas/index.';
import AuthFormSubmitButton from './AuthFormSubmitButton';
import AuthFormHeader from './AuthFormHeader';
import AuthFormFooter from './AuthFormFooter';
import SignUpFormFields from './SignUpForm';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/app/(auth)/_authActions/user.actions';
import PlaidLink from './PlaidLink';
import ZodFormFieldInput from './ZodAuthFormFieldInput';

export default function AuthForm({ type }: AuthFormProps) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formSchema = AUTH_FORM_SCHEMA(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      if (type === 'sign-in') {
        const user = await signIn({ email: data.email, password: data.password });
        setUser(user);
        router.push('/');
      }
      if (type === 'sign-up') {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          name: `${data.firstName} ${data.lastName}`!,
          address1: data.address1!,
          city: data.city!,
          state: data.state!,
          postalCode: data.postalCode!,
          dateOfBirth: data.dateOfBirth!,
          ssn: data.ssn!,
          email: data.email,
          password: data.password,
        };
        const newUser = await signUp(userData);
        setUser(newUser);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  return (
    <section className='auth-form'>
      <AuthFormHeader
        type={type}
        user={user}
      />
      {user && type === 'sign-up' ? (
        <div className='flex flex-col gap-4'>
          <PlaidLink
            user={user!}
            variant='primary'
          />
        </div>
      ) : (
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-8'
            >
              {type === 'sign-up' && <SignUpFormFields form={form} />}

              {/* email input */}
              <ZodFormFieldInput
                name='email'
                label='Email'
                placeholder='example@example.com'
                control={form.control}
              />
              {/* password input */}
              <ZodFormFieldInput
                name={'password'}
                label='Password'
                placeholder='∙∙∙∙∙∙∙'
                control={form.control}
                obscure
              />
              {/* Submit button */}
              <AuthFormSubmitButton
                type={type}
                isLoading={isLoading}
              />
            </form>
          </Form>
          <AuthFormFooter type={type} />
        </>
      )}
    </section>
  );
}
