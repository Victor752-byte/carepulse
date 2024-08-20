import RegisterForm from "@/components/forms/RegisterForm"
import { getUser } from "@/lib/actions/patient.actions"
import Image from "next/image"
import Link from "next/link"
// import { redirect } from "next/navigation";

const Register = async ({params: {userId}}: SearchParamProps) => {
  const user = await getUser(userId)
  // const patient = await getPatient(userId);

  // if (patient) redirect(`/patients/${userId}/new-appointment`);
    return (
        <div className="flex h-screen max-h-screen">
      {/* TODO: OTP Verification or PasskeyModal   */}
     <section className="remove-scrollbar container">
       <div className="sub-container max-w-[860px]">
        <Image 
          src='/assets/icons/logo-full.svg'
          width={1000}
          height={1000}
          alt="patient"
          className="mb-12 h-10 w-fit"
        /> 

        <RegisterForm user={user} />

        <p className="copy-right py-12">
          © 2024 CarePulse
          </p>

       </div>
     </section>
 
     <Image 
     src='/assets/images/register-img.png'
     width={1000}
     height={1000}
     alt="patient"
     className="side-img max-w-[390px]"
     />
    </div>
    )
}

export default Register