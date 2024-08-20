"use server"
import { ID, Query } from "node-appwrite"
import { BUCKET_ID, users, storage, databases, DATABASE_ID, PATIENT_COLLECTION_ID, ENDPOINT, PROJECT_ID, APPOINTMENT_COLLECTION_ID, messaging } from "../appwrite.config"
import { parseStringify } from "../utils"
import { Appointment } from "@/types/appwrite.types"
import { revalidatePath } from "next/cache"
import { formatDateTime } from "@/lib/utils"

// Create Appointment
export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
          )
          return parseStringify(newAppointment); 
    } catch (error) {
        console.log("An error occurred while creating a new appointment:", error);
    }
}

// Get appointment
export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId
        )
        return parseStringify(appointment); 
    } catch (error) {
        console.log(error)
    }
}

// Get appointment document
export const getRecentAppointmentList = async () => {
    try {
        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [ Query.orderDesc('$createdAt') ],
            
        );
        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0
        }
        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) =>{
            if (appointment.status === 'scheduled') {
                acc.scheduledCount += 1;
            } else if (appointment.status === 'pending'){
                acc.pendingCount += 1;
            }  else if (appointment.status === 'cancelled'){
                acc.cancelledCount += 1;
            }
            return acc;
        }, initialCounts);

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents
        }
        return parseStringify(data)
    } catch (error) {
        console.log(error)
    }
}

// Update appointment
export const updateAppointment = async ({appointmentId, appointment, userId, type}: UpdateAppointmentParams) => {
    try {
        const updatedAppointment = await databases.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
            appointment
        )
        if(!updatedAppointment){
            throw new Error('Appointment not found')
        }
        // TODO: SMS notification
        const smsMessage = `
        Hi, it's CarePulse. 
        ${type === 'schedule'
             ? `Your appointment has been scheduled for ${formatDateTime(appointment.schedule).dateTime} with Dr. ${appointment.primaryPhysician}` 
             : `We regret to inform you that your appointment has been cancelled for the following reason: ${appointment.cancellationReason}`
            }
        `

        await sendSMSNotification(userId, smsMessage)

        revalidatePath('/admin')
        return parseStringify(updatedAppointment); 
    } catch (error) {
        console.log(error)
    }
}

// Send SMS notification
export const sendSMSNotification = async (userId: string, content: string) => {
    try {
        const sendSms = await messaging.createSms(
            ID.unique(),
            content,
            [],
            [userId]
        ) 
        return parseStringify(sendSms);
    } catch (error) {
        console.log(error)
    }
}
