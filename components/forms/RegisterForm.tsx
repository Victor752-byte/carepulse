"use client"
 import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { PatientFormValidation } from "@/lib/validation"
import { useForm } from "react-hook-form"

import SubmitButton from "../SubmitButton"
import {
  Form,
  FormControl
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import CustomFormField from "./CustomFormFields"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"

 

 
const RegisterForm = ({user}: {user: User})=> {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: ""
    },
  })
 
  

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);
    let formData;
    if(values.identificationDocument && values.identificationDocument.length > 0){
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      })
      formData =  new FormData();
      formData.append('blobFile', blobFile);
      formData.append('fiileName', values.identificationDocument[0].name)
    }

    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData
      }
      const patient = await registerPatient(patientData)
      
      if (patient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
          <h1 className="header">Welcome &#129306;</h1>
          <p className="text-dark-700">Let us know more about yourself</p>
        </section>
        <section className="space-y-6">
            <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
            </div>
        </section>
          <CustomFormField 
          fieldType={FormFieldType.INPUT}
          control={form.control} 
          label="Full Name"
          name="name"
          placeholder='John Doe'
          iconSrc='/assets/icons/user.svg'
          iconAlt='user'
          />
          <div className="flex flex-col gap-6 xl:flex-row">
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
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
          fieldType={FormFieldType.DATE_PICKER}
          control={form.control} 
          name="birthDate"
          label='Date of Birth'
          
          />
          <CustomFormField 
          fieldType={FormFieldType.SKELETON}
          control={form.control} 
          name="gender"
          label='Gender'
          renderSkeleton={(field) => (
            <FormControl>
              <RadioGroup className="flex h-11 gap-6 xl:justify-between" onValueChange={field.onChange} defaultValue={field.value}>
                {GenderOptions.map((option) => (
                  <div key={option} className="radio-group">
                    <RadioGroupItem value={option} id={option}/>
                      <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
          )}
          />
          </div>
         <div className="flex flex-col gap-6 xl:flex-row ">
         <CustomFormField 
          fieldType={FormFieldType.INPUT}
          control={form.control} 
          name="address"
          label='Address'
          placeholder='17th Street, New York'
          />
          <CustomFormField 
          fieldType={FormFieldType.INPUT}
          control={form.control} 
          name="occupation"
          label='Occupation'
          placeholder="Software Engineer"
          />
         </div>
         {/* Emergency Contact Name and Number */}
         <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
          fieldType={FormFieldType.INPUT}
          control={form.control} 
          name="emergencyContactName"
          label='Emergency contact name'
          placeholder="Guardian's name"
          />
          <CustomFormField 
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control} 
          name="emergencyContactNumber"
          label='Emergency contact number'
          placeholder='(213) 373-4253'
          />
          </div>
          <section className="space-y-6">
            <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
            </div>
        </section>
        <CustomFormField 
          fieldType={FormFieldType.SELECT}
          control={form.control} 
          name="primaryPhysician"
          label='Primary Physician'
          placeholder="Select a physician"
          >
            {Doctors.map((doctors) => (
              <SelectItem key={doctors.name} value={doctors.name}>
                <div className="flex gap-2 items-center cursor-pointer">
                  <Image
                  src={doctors.image}
                  width={32}
                  height={32}
                  alt={doctors.name}
                  className='rounded-full border border-dark-500'
                  />
                  <p>{doctors.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
        <div className="flex flex-col gap-6 xl:flex-row ">
         <CustomFormField 
          fieldType={FormFieldType.INPUT}
          control={form.control} 
          name="insuranceProvider"
          label='Insurance Provider'
          placeholder='BlueCross BlueShield'
          />
          <CustomFormField 
          fieldType={FormFieldType.INPUT}
          control={form.control} 
          name="insurancePolicyNumber"
          label='Insurance policy number'
          placeholder="ABC123456789"
          />
         </div>
         <div className="flex flex-col gap-6 xl:flex-row ">
         <CustomFormField 
          fieldType={FormFieldType.TEXTAREA}
          control={form.control} 
          name="allergies"
          label='Allergies (if any)'
          placeholder='Peanuts, Penicillin, Pollen'
          />
          <CustomFormField 
          fieldType={FormFieldType.TEXTAREA}
          control={form.control} 
          name="currentMedication"
          label='Current medication (if any)'
          placeholder="Ibuprofen 200mg, Paracetamol"
          />
         </div>
         <div className="flex flex-col gap-6 xl:flex-row ">
         <CustomFormField 
          fieldType={FormFieldType.TEXTAREA}
          control={form.control} 
          name="familyMedicalHistory"
          label='Family medical history'
          placeholder='Mother had brain cancer, Father had heart disease'
          />
          <CustomFormField 
          fieldType={FormFieldType.TEXTAREA}
          control={form.control} 
          name="pastMedicalHistory"
          label='Past medical history'
          placeholder="Appendectomy, Tonsillectomy"
          />
         </div>
         <section className="space-y-6">
            <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
            </div>
        </section>
        <CustomFormField 
          fieldType={FormFieldType.SELECT}
          control={form.control} 
          name="identificationType"
          label='Identification type'
          placeholder="Select an identification type"
          >
            {IdentificationTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>
          <CustomFormField 
          fieldType={FormFieldType.INPUT}
          control={form.control} 
          name="identificationNumber"
          label='Identification number'
          placeholder="123456789"
          />
          <CustomFormField 
          fieldType={FormFieldType.SKELETON}
          control={form.control} 
          name="identificationDocument"
          label='Scaned copy of identification document'
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange}/>
            </FormControl>
          )}
          />
          <section className="space-y-6">
            <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
            </div>
        </section>
        <CustomFormField 
          fieldType={FormFieldType.CHECKBOX}
          control={form.control} 
          name="treatmentConsent"
          label='I consent to receive treatment for my health condition'
          />
          <CustomFormField 
          fieldType={FormFieldType.CHECKBOX}
          control={form.control} 
          name="disclosureConsent"
          label='I consent to the use and disclosure of my health information for treatment purposes'
          />
          <CustomFormField 
          fieldType={FormFieldType.CHECKBOX}
          control={form.control} 
          name="privacyConsent"
          label='I acknowledge that i have reviewed and agree to the privacy policy'
          />
        <SubmitButton isLoading={isLoading} >Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm;