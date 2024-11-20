'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'

// Create a separate component for the button contents
function ButtonContent() {
    const { pending } = useFormStatus()
    console.log(pending)
    return (
        <>
            <span className={pending ? 'text-transparent' : ''}>Submit</span>
            {pending && (
                <span className="flex items-center justify-center w-full h-full absolute text-white">
                    <LoaderCircle className="animate-spin" />
                </span>
            )}
        </>
    )
}

// Main button component
export default function SubmitButton() {
    return (
        <Button type="submit" className="relative">
            <ButtonContent />
        </Button>
    )
}