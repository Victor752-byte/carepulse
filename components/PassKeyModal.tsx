'use client'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
  import { decryptKey, encryptKey } from '@/lib/utils'
  
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PasskeyModal = () => {
    const router = useRouter()
    const path = usePathname()
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(true);
    const [passkey, setPassKey] = useState('')
    const [error, setError] = useState('')

    const encryptedKey = typeof window !== 'undefined' ? window.localStorage.getItem('accessKey') : null
    
    // First Method -my method; yeh i'm improving
    // useEffect(() =>{
    //   const accesskey = encryptedKey && decryptKey(encryptedKey);
    //   // Check if the URL includes '?admin=true'
    // const isAdmin = searchParams.get('admin') === 'true';
    //   if(isAdmin){
    //     if(accesskey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY!.toString()){
    //       setOpen(false)
    //       router.push('/admin')
    //     }else{
    //       setOpen(true)
    //     }
    //   }
    // }, [encryptedKey, searchParams, router]);

    // Second method 
    useEffect(() => {
      const accessKey = encryptedKey && decryptKey(encryptedKey);
  
      if (path){
        if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY!.toString()) {
          setOpen(false);
          router.push("/admin");
        } else {
          setOpen(true);
        }
      }
        
    }, [encryptedKey, path, router]);

    const closeModal = () => {
        setOpen(false)
        router.push('/')
    }

    const validatePasskey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
        e.preventDefault;
        if(passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY){
          const encryptedKey = encryptKey(passkey)
          localStorage.setItem("accessKey", encryptedKey)
          setOpen(false)
          router.push('/admin')
        }else{
          setError('Invalid passkey, please try again')
        }
  
    }
  
    return (
        <AlertDialog open={open}>
        <AlertDialogContent className="shad-alert-dialog w-fit">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-start justify-between">
                Admin access verification
                <Image
                src='/assets/icons/close.svg'
                width={20}
                height={20}
                alt="close"
                onClick={closeModal}
                className="cursor-pointer"
                />
                </AlertDialogTitle>
            <AlertDialogDescription>
             To access the admin page, please enter the passkey
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div>
          <InputOTP maxLength={6} value={passkey} onChange={value => setPassKey(value)}>
            <InputOTPGroup className="shad-otp">
                <InputOTPSlot className="shad-otp-slot" index={0} />
                <InputOTPSlot className="shad-otp-slot" index={1} />
                <InputOTPSlot className="shad-otp-slot" index={2} />
                <InputOTPSlot className="shad-otp-slot" index={3} />
                <InputOTPSlot className="shad-otp-slot" index={4} />
                <InputOTPSlot className="shad-otp-slot" index={5} />
            </InputOTPGroup>
            </InputOTP>
            {error && <p className="shad-error text-14-regular mt-4 flex justify-center">{error}</p>}
          </div>
          <AlertDialogFooter>
            <AlertDialogAction className="shad-primary-btn w-full" onClick={(e) => validatePasskey(e)}>Enter Admin Passkey</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
}

export default PasskeyModal;