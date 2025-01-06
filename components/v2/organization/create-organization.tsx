'use client'

import { useState } from 'react'
import { useOrganizationList } from '@clerk/nextjs'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import LogoSvg from "@/components/logo-svg"
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreateOrganization() {
  const { createOrganization, isLoaded } = useOrganizationList()
  const [orgName, setOrgName] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const formatSlug = (value: string) => {
    return value
      .toLowerCase()
      .replace(/\s+/g, '-') 
      .replace(/[^a-z0-9-]/g, '') 
  }

  const generateUniqueNumber = () => {
    return Math.floor(1000 + Math.random() * 9000);
  }

  const handleOrgNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setOrgName(value)
    setSlug(formatSlug(value) + '-' + generateUniqueNumber());
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSlug(formatSlug(value))
  }

  const validateForm = () => {
    if (!orgName.trim()) {
      return "Organization name is required."
    }
    if (!slug.trim()) {
      return "Slug is required."
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      if (createOrganization && isLoaded) {
        await createOrganization({
          name: orgName.trim(),
          slug: slug.trim(),
        })
        setOrgName('')
        setSlug('')
        setError(null)
        router.push(`/${slug.trim()}`)
      }
    } catch (err) {
      console.error('Error creating organization:', err)
      setError("Failed to create the organization. Please try again.")
    }
  }

  return (
    <div className="h-[100svh] flex items-center justify-center p-4">
      <div className="w-full sm:max-w-md sm:w-md">
        <Card className="w-full border-b-0 rounded-b-none bg-background">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight">
              Create organization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                <Input
                  id="name"
                  value={orgName}
                  onChange={handleOrgNameChange}
                  placeholder="Organization name"
                  className="mt-1.5 font-medium bg-transparent dark:bg-muted/20"
                />
                {error && (
                  <div className="text-red-500 text-xs mt-1 font-medium">{error}</div>
                )}
              </div>

              <div>
                <Label htmlFor="slug" className="text-sm font-medium">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="eg. my-org"
                  className="mt-1.5 font-medium bg-transparent dark:bg-muted/20"
                />
              </div>

              <div className="pt-2 w-full">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                >
                  Create organization
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="bg-blue-500/10 px-4 py-3 flex items-center justify-end rounded-b-lg">
          <div className="flex gap-2 items-center opacity-50">
            <LogoSvg fill="currentColor" />
            <span className="text-sm font-semibold">Invoicedia</span>
          </div>
        </div>
      </div>
    </div>
  )
}
