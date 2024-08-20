"use client"
 import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { getAppointmentSchema } from "@/lib/validation"
import { useForm } from "react-hook-form"

import SubmitButton from "../SubmitButton"
import {
  Form
} from "@/components/ui/form"

import CustomFormField from "./CustomFormFields"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions"
import { Doctors } from "@/constants"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { Appointment } from "@/types/appwrite.types"
import { formatDateTime } from "@/lib/utils"

export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton'
}
 

 
const AppointmentForm = ({ type, userId, patientId, appointment, setOpen}: {
  type: "create" | "cancel" | "schedule",
  userId: string,
  patientId: string,
  appointment?: Appointment,
  setOpen?: (value: boolean) => void
})=> {

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel= 'Cancel Appointment'
      break; 
    case "create":
      buttonLabel= 'Create Appointment'
      break;
     case "schedule":
      buttonLabel = 'Schedule Appointmnet'
      break;
    default:
      break;
  }

  const AppointmentFormValidation = getAppointmentSchema(type)

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : "",
      schedule: appointment ? new Date(appointment.schedule) : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment ? appointment.note : "",
      cancellationReason:  appointment?.cancellationReason || "",
    },
  })
 
  const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
    setIsLoading(true);

    let status;
    switch (type) {
      case 'schedule':
        status = 'scheduled' 
        break;
      case 'cancel':
        status = "cancelled"  
        break;
      default:
        status = 'pending';
        break;
    }

    try {
      if( type === 'create' && patientId){
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status
         }
         const appointment = await createAppointment(appointmentData)
         if (appointment) {
          form.reset()
          router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);
        }
      }else{
         const appointmentToUpdate = {
          userId,
          appointmentId: appointment!.$id,
          appointment: {
            primaryPhysician: values?.primaryPhysician,
            schedule: new Date(values?.schedule),
            status: status as Status,
            cancellationReason: values?.cancellationReason
          },
          type
         }
         const updatedAppointment = await updateAppointment(appointmentToUpdate)
         if(updatedAppointment){
          setOpen && setOpen(false)
          form.reset()
         }
      }
    
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        { type === 'create' && 
        <section className="space-y-4 mb-12">
        <h1 className="header">New Appointment</h1>
        <p className="text-dark-700">Request a new appointment in 10 seconds</p>
      </section>
        }
        { type !== 'cancel' && (
          <>
          <CustomFormField 
          fieldType={FormFieldType.SELECT}
          control={form.control} 
          name="primaryPhysician"
          label='Doctor'
          placeholder="Select a doctor"
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
          <CustomFormField 
          fieldType={FormFieldType.DATE_PICKER}
          control={form.control} 
          name="schedule"
          label='Expected appointment date'
          placeholder="Select your appointment date"
          showTimeSelect
          dateFormat="MM/dd/yyyy h:mm aa"
          />
          <div className="flex flex-col gap-6 xl:flex-row ">
         <CustomFormField 
          fieldType={FormFieldType.TEXTAREA}
          control={form.control} 
          name="reason"
          label='Reason for appointment'
          placeholder='ex: Annual monthly check-up'
          />
          <CustomFormField 
          fieldType={FormFieldType.TEXTAREA}
          control={form.control} 
          name="note"
          label='Additional comments/notes'
          placeholder="ex: Prefer afternooon appointments, if possible"
          />
         </div>
         
          </>
        )}

        { type === 'cancel' && (
          <>
          <CustomFormField 
          fieldType={FormFieldType.TEXTAREA}
          control={form.control} 
          name="cancellationReason"
          label='Reason for cancellation'
          placeholder='Enter reason for cancellation'
          />
          </>
        )}
          
        <SubmitButton isLoading={isLoading} className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`} >{buttonLabel}</SubmitButton>
      </form>
    </Form>
  )
}

export default AppointmentForm;