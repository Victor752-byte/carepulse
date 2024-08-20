import Link from "next/link";
import Image from "next/image";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Success = async ({params: {userId}, searchParams}: SearchParamProps) => {
    const appointmnentId = (searchParams?.appointmentId as string) || '';
    const appointment = await getAppointment(appointmnentId)
    const doctor = Doctors.find((doctor) => doctor.name === appointment.primaryPhysician)
    console.log(appointmnentId)
    return(
        <div className="flex h-screen max-h-screen px-[5%]">
            <div className="success-img">
                <Link href='/'>
                <Image 
                src='/assets/icons/logo-full.svg'
                width={1000}
                height={1000}
                alt="patient"
                className="h-10 w-fit"
                /> 
                </Link>
                <section className="flex flex-col items-center">
                <Image 
                src='/assets/gifs/success.gif'
                width={300}
                height={280}
                alt="success" 
                /> 
                    <h2 className="header mb-6 max-w-[600px] text-center">Your <span className="text-green-500">appointment request </span>has been successfully submited</h2>
                    <p>We will be in touch shortly</p>
                </section>

                <section className="request-details">
                    <p>Requested appointment details</p>
                    <div className="flex items-center gap-3">
                        <Image
                        src={doctor?.image!}
                        width={100}
                        height={100}
                        alt="doctor"
                        className="size-6"
                        />
                        <p className="whitespace-nowrap ">Dr. {doctor?.name}</p>
                    </div>
                    <div className="flex gap-2">
                    <Image
                    src='/assets/icons/calendar.svg'
                    width={24}
                    height={24}
                    alt="calendar"
                    />
                    <p>{formatDateTime(appointment.schedule).dateTime}</p>
                    </div>
                </section>
                <Button asChild variant="outline" className="shad-primary-btn">
                <Link href={`/patients/${userId}/new-appointment`}>Create appointment</Link>
                </Button>
                <p className="copyright">
                © 2024 CarePulse
                </p>

            </div>
        </div>
    )
}

export default Success;