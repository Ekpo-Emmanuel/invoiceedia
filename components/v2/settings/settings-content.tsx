"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import BusinessInfoSettings from "./business-info-settings"
import InvoicePreferencesSettings from "./invoice-preferences-settings"
import PaymentOptionsSettings from "./payment-options-settings"
import EmailNotificationsSettings from "./email-notifications-settings"
import DataSecuritySettings from "./data-security-settings"

interface SettingsContentProps {
  organization: any;
  organizationSlug: string;
}

export default function SettingsContent({ organization, organizationSlug }: SettingsContentProps) {
  const [activeTab, setActiveTab] = useState("business-info")

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="business-info" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="business-info">Business Info</TabsTrigger>
          <TabsTrigger value="invoice-preferences">Invoice Preferences</TabsTrigger>
          <TabsTrigger value="payment-options">Payment Options</TabsTrigger>
          <TabsTrigger value="email-notifications">Email & Notifications</TabsTrigger>
          <TabsTrigger value="data-security">Data & Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="business-info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business & Personal Info</CardTitle>
              <CardDescription>
                Update your business information for professional invoices.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BusinessInfoSettings 
                organization={organization}
                organizationSlug={organizationSlug}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoice-preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Preferences</CardTitle>
              <CardDescription>
                Customize your default invoice settings for faster invoicing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvoicePreferencesSettings 
                organization={organization}
                organizationSlug={organizationSlug}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment-options" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Options</CardTitle>
              <CardDescription>
                Configure payment methods and reminders for easier collection.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentOptionsSettings 
                organization={organization}
                organizationSlug={organizationSlug}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email-notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email & Notifications</CardTitle>
              <CardDescription>
                Manage email templates and notification preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmailNotificationsSettings 
                organization={organization}
                organizationSlug={organizationSlug}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data-security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data & Security</CardTitle>
              <CardDescription>
                Control your data and account security settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataSecuritySettings 
                organization={organization}
                organizationSlug={organizationSlug}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 