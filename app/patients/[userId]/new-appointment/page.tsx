import AppointmentForm from "@/components/forms/AppointmentForm";
import Link  from "next/link";
import Image from "next/image";
import { getPatient } from "@/lib/actions/patient.actions";



export default async function NewAppointment({ params: {userId}}: SearchParamProps) {
  const patient = await getPatient(userId);
  return (
    <div className="flex h-screen max-h-screen">
     
     <section className="remove-scrollbar container ">
       <div className="sub-container max-w-[496px]">
        <Image 
          src='/assets/icons/logo-full.svg'
          width={1000}
          height={1000}
          alt="patient"
          className="mb-12 h-10 w-fit"
        /> 

        <AppointmentForm
        type='create'
        userId={userId}
        patientId={patient.$id}
         />

          <p className="justify-items-end text-dark-600 xl:text-left mt-10" py-12>
          © 2024 CarePulse
          </p>

       </div>
     </section>
 
     <Image 
     src='/assets/images/appointment-img.png'
     width={1000}
     height={1000}
     alt="appointment"
     className="side-img max-w-[390px] bg-bottom"
     />
      {/* <Button>click me</Button> */}
    </div>
  );
}
