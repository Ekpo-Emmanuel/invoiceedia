'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Asterisk } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { businessClientSchema, BusinessFormData } from './validation-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import clsx from "clsx"
import { toast } from 'sonner'
import { getOrgSlugFromUrl } from '@/utils/clientUtils'

interface BusinessFormProps {
    onFormChange?: (data: BusinessFormData) => void;
}

export default function BusinessForm({ onFormChange }: BusinessFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    
    const form = useForm<BusinessFormData>({
        resolver: zodResolver(businessClientSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            companyName: '',
            email: '',
            phone: '',
            street: '',
            city: '',
            zip: '',
            state: '',
            country: '',
            notes: '',
        }
    })

    useEffect(() => {
        const subscription = form.watch((value, { name, type }) => {
            if (onFormChange && type === 'change') {
                onFormChange(value as BusinessFormData)
            }
        })
        return () => subscription.unsubscribe()
    }, [form, onFormChange])

    const onSubmit = async (data: BusinessFormData) => {
        setIsLoading(true)
        setError('')

        try {
            const orgSlug = getOrgSlugFromUrl()
            
            const response = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    orgSlug
                }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.message || 'Failed to create client')
            }

            // router.refresh()
            toast.success('Client created successfully')
            router.push(`/${orgSlug}/clients`)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while creating the client.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Company Name */}
                <div className="space-y-2">
                    <Label 
                        htmlFor="companyName" 
                        className={clsx(
                            "flex items-start", 
                            // form.formState.errors.companyName && "text-red-500"
                        )}
                    >
                        Company Name
                        <Asterisk className='text-red-500 w-3 h-3'/>
                    </Label>
                    <Input
                        {...form.register("companyName")}
                        className="font-medium bg-transparent dark:bg-muted/20"
                        placeholder="Acme Inc."
                    />
                    {form.formState.errors.companyName && (
                        <p className="text-xs text-red-500">{form.formState.errors.companyName.message}</p>
                    )}
                </div>

                {/* Contact Person Name Fields */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName" className="flex items-start">
                            First Name
                            <Asterisk className='text-red-500 w-3 h-3'/>
                        </Label>
                        <Input
                            {...form.register("firstName")}
                            className="font-medium bg-transparent dark:bg-muted/20"
                            placeholder="John"
                        />
                        {form.formState.errors.firstName && (
                            <p className="text-xs text-red-500">{form.formState.errors.firstName.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName" className="flex items-start">
                            Last Name
                            <Asterisk className='text-red-500 w-3 h-3'/>
                        </Label>
                        <Input
                            {...form.register("lastName")}
                            className="font-medium bg-transparent dark:bg-muted/20"
                            placeholder="Doe"
                        />
                        {form.formState.errors.lastName && (
                            <p className="text-xs text-red-500">{form.formState.errors.lastName.message}</p>
                        )}
                    </div>
                </div>

                {/* email */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-start">
                        Email
                        <Asterisk className='text-red-500 w-3 h-3'/>
                    </Label>
                    <Input
                        {...form.register("email")}
                        type="email"
                        className="font-medium bg-transparent dark:bg-muted/20"
                        placeholder="contact@acmeinc.com"
                    />
                    {form.formState.errors.email && (
                        <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                    )}
                </div>

                {/* phone */}
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        {...form.register("phone")}
                        type="tel"
                        className="font-medium bg-transparent dark:bg-muted/20"
                        placeholder="+1 (123) 456-7890"
                    />
                    {form.formState.errors.phone && (
                        <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>
                    )}
                </div>

                {/* Company Address */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="street">Address Line 1</Label>
                        <Input
                            {...form.register("street")}
                            className="font-medium bg-transparent dark:bg-muted/20"
                            placeholder="123 Business Ave"
                        />
                        {form.formState.errors.street && (
                            <p className="text-xs text-red-500">{form.formState.errors.street.message}</p>
                        )}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                {...form.register("city")}
                                className="font-medium bg-transparent dark:bg-muted/20"
                                placeholder="New York"
                            />
                            {form.formState.errors.city && (
                                <p className="text-xs text-red-500">{form.formState.errors.city.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="zip">Zip/Postal Code</Label>
                            <Input
                                {...form.register("zip")}
                                className="font-medium bg-transparent dark:bg-muted/20"
                                placeholder="10001"
                            />
                            {form.formState.errors.zip && (
                                <p className="text-xs text-red-500">{form.formState.errors.zip.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="state">State/Province</Label>
                            <Input
                                {...form.register("state")}
                                className="font-medium bg-transparent dark:bg-muted/20"
                                placeholder="New York"
                            />
                            {form.formState.errors.state && (
                                <p className="text-xs text-red-500">{form.formState.errors.state.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Select
                                onValueChange={(value) => form.setValue('country', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="US">United States</SelectItem>
                                    <SelectItem value="CA">Canada</SelectItem>
                                    <SelectItem value="UK">United Kingdom</SelectItem>
                                </SelectContent>
                            </Select>
                            {form.formState.errors.country && (
                                <p className="text-xs text-red-500">{form.formState.errors.country.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Notes*/}
                <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea 
                        {...form.register("notes")}
                        placeholder="Type your notes here." 
                        className="font-medium bg-transparent dark:bg-muted/20"
                    />
                    {form.formState.errors.notes && (
                        <p className="text-xs text-red-500">{form.formState.errors.notes.message}</p>
                    )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Client'}
                </Button>
            </form>
        </div>
    )
}
