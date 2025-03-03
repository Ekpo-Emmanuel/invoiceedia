'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Asterisk } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClientPreview } from './client-form-preview'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import IndividualForm from './individual-form'
import BusinessForm from './business-form'

interface ClientData {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
  state: string;
  country: string;
  notes: string;
}

export default function NewClientForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [clientData, setClientData] = useState({
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
  })

  const handleFormChange = (data: Partial<ClientData>) => {
    setClientData(prev => ({
      ...prev,
      ...data
    }))
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="w-full sm:max-w-lg">
        <Card className="w-full rounded-b-none bg-background">
          <CardContent className="pt-6">
            <Tabs defaultValue="individual">
                <div className="flex justify-between items-center">
                    <CardTitle>Create New Client</CardTitle>
                    <TabsList>
                        <TabsTrigger value="individual">Individual</TabsTrigger>
                        <TabsTrigger value="business">Business</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="individual">
                    <div className="mt-8">
                        <IndividualForm onFormChange={handleFormChange} />
                    </div>
                </TabsContent>
                <TabsContent value="business">
                    <div className="mt-8">
                        <BusinessForm onFormChange={handleFormChange} />
                    </div>
                </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="w-full relative">
        <ClientPreview clientData={clientData}/>
      </div>
    </div>
  )
}
