import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { UseFormReturn } from "react-hook-form"
import * as z from "zod"
import { currencies, formSchema } from "../invoice-preferences-settings"

interface GeneralSettingsTabProps {
  form: UseFormReturn<z.infer<typeof formSchema>>
  watchEnableTax: boolean
}

export function GeneralSettingsTab({ form, watchEnableTax }: GeneralSettingsTabProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="invoicePrefix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invoice Prefix</FormLabel>
              <FormControl>
                <Input placeholder="INV-" {...field} />
              </FormControl>
              <FormDescription>
                This will be added before the invoice number (e.g., INV-001).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentTerms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Payment Terms</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
                  <SelectItem value="net_7">Net 7 Days</SelectItem>
                  <SelectItem value="net_15">Net 15 Days</SelectItem>
                  <SelectItem value="net_30">Net 30 Days</SelectItem>
                  <SelectItem value="net_60">Net 60 Days</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Default payment terms for new invoices.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Currency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Default currency for new invoices.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Tax & Discount Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="enableTax"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Enable Tax</FormLabel>
                  <FormDescription>
                    Allow adding tax to invoices.
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
            name="enableDiscount"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Enable Discount</FormLabel>
                  <FormDescription>
                    Allow adding discounts to invoices.
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
        </div>

        {watchEnableTax && (
          <FormField
            control={form.control}
            name="defaultTaxRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Tax Rate (%)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} />
                </FormControl>
                <FormDescription>
                  Default tax rate to apply to new invoices.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </>
  )
} 