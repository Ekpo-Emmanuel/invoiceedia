'use client'

import { useFormStatus } from 'react-dom'
import { LoaderCircle } from 'lucide-react'

function ButtonContent() {
    const { pending } = useFormStatus()
    return (
        <>
            <span className={pending ? 'text-transparent' : ''}>Create Invoice</span>
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
        <button type="submit" className="relative flex items-center justify-center transition-all duration-200 focus:ring-2 focus:outline-none text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/50 h-10 px-6 py-3 text-base font-medium rounded-lg w-full">
            <ButtonContent />
        </button>
    )
}