"use client"
 import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserFormValidation } from "@/lib/validation"
import { useForm } from "react-hook-form"

import SubmitButton from "../SubmitButton"
import {
  Form
} from "@/components/ui/form"

import CustomFormField from "./CustomFormFields"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"

export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton'
}
 

 
const PatientForm = ()=> {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: ""
    },
  })
 
  // 2. Define a submit handler.
  // async function onSubmit({name, email, phone}: z.infer<typeof UserFormValidation>) {
  //   // Do something with the form values.
  //   // ✅ This will be type-safe and validated.
  //   console.log('name: ' + name + ' email:' + email +' phone: ' + phone)
    
  //   setIsLoading(true);
  //   console.log('isLoading is: ' + isLoading)

  //   try {
  //     const userData = {name, email, phone}
  //     const user = await createUser(userData);

  //     if(user) router.push(`/patients/${user.$id}/register`)
  //   } catch (error) {
  //     console.log(error)
  //   }
  //   // setIsLoading(false);
  // };

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    try {
      const user = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };

      const newUser = await createUser(user);
      
      if (newUser) {
        router.push(`/patients/${newUser.$id}/register`);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="space-y-4 mb-12">
          <h1 className="header">Hi there &#129306;</h1>
          <p className="text-dark-700">Schedule your first appointment</p>
        </section>
          <CustomFormField 
          fieldType={FormFieldType.INPUT}
          control={form.control} 
          name="name"
          label='Full name'
          placeholder='John Doe'
          iconSrc='/assets/icons/user.svg'
          iconAlt='user'
          />
          <CustomFormField 
          fieldType={FormFieldType.INPUT}
          control={form.control} 
          name="email"
          label='Email'
          placeholder='johndoe@gmail.com'
          iconSrc='/assets/icons/email.svg'
          iconAlt='email'
          />
          <CustomFormField 
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control} 
          name="phone"
          label='Phone Number'
          placeholder='(213) 373-4253'
          />
          
        <SubmitButton isLoading={isLoading} >Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm;