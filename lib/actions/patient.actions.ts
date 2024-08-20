"use server";
import { ID, Query} from "node-appwrite"
import { BUCKET_ID, users, storage, databases, DATABASE_ID, PATIENT_COLLECTION_ID, ENDPOINT, PROJECT_ID } from "../appwrite.config"
import { parseStringify } from "../utils"
import {InputFile} from "node-appwrite/file"

// Create User
export const createUser = async (user: CreateUserParams) => {
    try {
      // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
      const newuser = await users.create(
        ID.unique(),
        user.email,
        user.phone,
        undefined,
        user.name
      );
  
      return parseStringify(newuser);
    } catch (error: any) {
      console.log('error is: ' + error)
      // Check existing user
      if (error && error?.code === 409) {
        const existingUser = await users.list([
          Query.equal("email", [user.email]),
        ]);
  
        return existingUser.users[0];
      }
      console.error("An error occurred while creating a new user:", error);
    }
  };

  // Get User
  export const getUser = async (userId: string) =>{
    try {
      const user = await users.get(userId);
  
      return parseStringify(user);
    } catch (error) {
      console.error(
        "An error occurred while retrieving the user details:",
        error
      );
    }
  }

  // Register User
  export const registerPatient = async ({identificationDocument, ...patient}: RegisterUserParams) =>{
    let file;
    try {
      if(identificationDocument) {
        let inputFile = InputFile.fromBuffer(
          identificationDocument?.get('blobFile') as Blob,
          identificationDocument?.get('fileName') as string
        )
        file = await storage.createFile( BUCKET_ID!, ID.unique(), inputFile)
      }

      const newPatient = await databases.createDocument(
        DATABASE_ID!,
        PATIENT_COLLECTION_ID!,
        ID.unique(),
        {
          identificationDocumentId: file?.$id || null,
          identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
          ...patient
        }
      )
      return parseStringify(newPatient);
    } catch (error) {
      console.log('hi tochukwu check out this error: ' + error)
    }
    
  }

  // Get Patient
  export const getPatient = async (userId: string) =>{
    try {
      const patient = await databases.listDocuments(
        DATABASE_ID!,
        PATIENT_COLLECTION_ID!,
        [Query.equal('userId', userId)]
      );
  
      return parseStringify(patient.documents[0]);
      console.log('document: ' + patient.documents)
      console.log('document[0]: ' + patient.documents[0])
    } catch (error) {
      console.error(
        "An error occurred while retrieving the user details:",
        error
      );
    }
  }