"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PaymentOptionsSettingsProps {
  organization: any;
  organizationSlug: string;
}

const formSchema = z.object({
  // Bank Transfer
  bankName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  swiftBic: z.string().optional(),
  bankInstructions: z.string().optional(),
  
  // Online Payments
  paypalEmail: z.string().email().optional().or(z.literal("")),
  stripeEmail: z.string().email().optional().or(z.literal("")),
  
  // Reminders
  enableAutoReminders: z.boolean(),
  reminderFrequency: z.enum(["weekly", "biweekly", "monthly"]),
  reminderDaysBefore: z.string(),
  reminderDaysAfter: z.string(),
})

export default function PaymentOptionsSettings({ organization, organizationSlug }: PaymentOptionsSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("bank-transfer")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Bank Transfer
      bankName: organization.bankName || "",
      accountName: organization.accountName || "",
      accountNumber: organization.accountNumber || "",
      routingNumber: organization.routingNumber || "",
      swiftBic: organization.swiftBic || "",
      bankInstructions: organization.bankInstructions || "",
      
      // Online Payments
      paypalEmail: organization.paypalEmail || "",
      stripeEmail: organization.stripeEmail || "",
      
      // Reminders
      enableAutoReminders: organization.enableAutoReminders || false,
      reminderFrequency: organization.reminderFrequency || "weekly",
      reminderDaysBefore: organization.reminderDaysBefore?.toString() || "3",
      reminderDaysAfter: organization.reminderDaysAfter?.toString() || "7",
    },
  })

  const watchEnableAutoReminders = form.watch("enableAutoReminders")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // TODO: Implement the API call to update payment options
      console.log(values)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Payment options updated successfully")
    } catch (error) {
      toast.error("Failed to update payment options")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="bank-transfer" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
            <TabsTrigger value="bank-transfer">Bank Transfer</TabsTrigger>
            <TabsTrigger value="online-payments">Online Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bank-transfer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bank Transfer Details</CardTitle>
                <CardDescription>
                  Provide your bank details for clients to make direct transfers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Bank of America" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Holder Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="routingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Routing Number</FormLabel>
                        <FormControl>
                          <Input placeholder="987654321" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="swiftBic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SWIFT/BIC Code (International)</FormLabel>
                      <FormControl>
                        <Input placeholder="BOFAUS3N" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bankInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Instructions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please include invoice number in the payment reference."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Any special instructions for bank transfers.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="online-payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Online Payment Options</CardTitle>
                <CardDescription>
                  Set up online payment methods for faster payments.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="paypalEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PayPal Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        The email address associated with your PayPal account.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stripeEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stripe Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        The email address associated with your Stripe account.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Payment Reminders</CardTitle>
            <CardDescription>
              Configure automatic payment reminders for unpaid invoices.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="enableAutoReminders"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Automatic Reminders</FormLabel>
                    <FormDescription>
                      Send automatic reminders for unpaid invoices.
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

            {watchEnableAutoReminders && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="reminderFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reminder Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How often to send reminders for unpaid invoices.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="reminderDaysBefore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Days Before Due Date</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormDescription>
                          Send a reminder this many days before due date.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reminderDaysAfter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Days After Due Date</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormDescription>
                          Send a reminder this many days after due date.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 