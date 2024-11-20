'use client'

import React, { useState, useEffect, SyntheticEvent, startTransition } from 'react'
import Form from 'next/form'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import SubmitButton from '@/components/custom/SubmitButton'
import { createAction } from '@/app/actions'

export default function page() {
    const [state, setState] = useState('ready');

    async function handleOnSubmit(e: SyntheticEvent) {

        if (state === 'pending') {
            e.preventDefault();
            return;
        }

        setState('pending');
    }

  return (
    <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-12 md:py-24">
            <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-semibold'>Create Invoice</h2>
            </div>
            <form action={createAction} onSubmit={handleOnSubmit} className='grid gap-4 max-w-md'>
                <div>
                    <Label htmlFor="name" className="block mb-2 font-semibold text-sm">Billing Name</Label>
                    <Input id="name" name="name" type="text" />
                </div>
                <div>
                    <Label htmlFor="email" className="block mb-2 font-semibold text-sm">Billing Email</Label>
                    <Input id="email" name="email" type="text" />
                </div>
                <div>
                    <Label htmlFor="value" className="block mb-2 font-semibold text-sm">Value</Label>
                    <Input id="value" name="value" type="text" />
                </div>
                <div className="grid w-full gap-2">
                    <Label htmlFor="description" className="block font-semibold text-sm">Billing Name</Label>
                    <Textarea id="description" name="description" placeholder="Type your message here." />
                </div>
                <SubmitButton />
            </form>
        </div>
    </div>
  )
}
