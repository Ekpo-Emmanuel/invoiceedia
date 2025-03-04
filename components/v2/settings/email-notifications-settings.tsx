"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EmailNotificationsSettingsProps {
  organization: any;
  organizationSlug: string;
}

const formSchema = z.object({
  // Email Templates
  invoiceTemplate: z.string(),
  reminderTemplate: z.string(),
  thankYouTemplate: z.string(),
  
  // Notification Settings
  notifyOnView: z.boolean(),
  notifyOnPayment: z.boolean(),
  notifyOnOverdue: z.boolean(),
})

export default function EmailNotificationsSettings({ organization, organizationSlug }: EmailNotificationsSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("email-templates")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Email Templates
      invoiceTemplate: organization.invoiceTemplate || 
        "Dear {{client_name}},\n\nPlease find attached invoice #{{invoice_number}} for {{invoice_amount}}.\n\nDue date: {{due_date}}\n\nThank you for your business.\n\nBest regards,\n{{business_name}}",
      reminderTemplate: organization.reminderTemplate || 
        "Dear {{client_name}},\n\nThis is a friendly reminder that invoice #{{invoice_number}} for {{invoice_amount}} is due on {{due_date}}.\n\nPlease let me know if you have any questions.\n\nBest regards,\n{{business_name}}",
      thankYouTemplate: organization.thankYouTemplate || 
        "Dear {{client_name}},\n\nThank you for your payment of {{invoice_amount}} for invoice #{{invoice_number}}.\n\nWe appreciate your business.\n\nBest regards,\n{{business_name}}",
      
      // Notification Settings
      notifyOnView: organization.notifyOnView || false,
      notifyOnPayment: organization.notifyOnPayment || true,
      notifyOnOverdue: organization.notifyOnOverdue || true,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // TODO: Implement the API call to update email and notification settings
      console.log(values)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Email and notification settings updated successfully")
    } catch (error) {
      toast.error("Failed to update email and notification settings")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="email-templates" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
            <TabsTrigger value="email-templates">Email Templates</TabsTrigger>
            <TabsTrigger value="notification-settings">Notification Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email-templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>
                  Customize the email templates used when sending invoices and reminders.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Available Variables:</h3>
                  <p className="text-xs text-muted-foreground">
                    <code>&#123;&#123;client_name&#125;&#125;</code>, <code>&#123;&#123;invoice_number&#125;&#125;</code>, <code>&#123;&#123;invoice_amount&#125;&#125;</code>, <code>&#123;&#123;due_date&#125;&#125;</code>, <code>&#123;&#123;business_name&#125;&#125;</code>
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="invoiceTemplate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Invoice Email</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your invoice email template"
                          className="min-h-[150px] font-mono text-sm"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        This template is used when sending a new invoice to a client.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reminderTemplate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Reminder Email</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your payment reminder template"
                          className="min-h-[150px] font-mono text-sm"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        This template is used when sending payment reminders.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thankYouTemplate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thank You Email</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your thank you email template"
                          className="min-h-[150px] font-mono text-sm"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        This template is used when sending a thank you email after payment.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notification-settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure when you receive notifications about your invoices.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="notifyOnView"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Invoice Viewed Notification</FormLabel>
                        <FormDescription>
                          Receive a notification when a client views an invoice.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notifyOnPayment"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Payment Received Notification</FormLabel>
                        <FormDescription>
                          Receive a notification when a payment is received.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notifyOnOverdue"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Overdue Invoice Notification</FormLabel>
                        <FormDescription>
                          Receive a notification when an invoice becomes overdue.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 