"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Client } from "@/types/client"
import { createInvoice } from "@/app/actions/invoices"
import { toast } from "sonner"
import { Trash2, Plus } from "lucide-react"
import { z } from "zod"

const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.string().min(1, "Quantity is required"),
  rate: z.string().min(1, "Rate is required"),
})

const invoiceSchema = z.object({
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  paymentTerms: z.enum(["due_on_receipt", "net_15", "net_30", "net_60"]),
  notes: z.string().optional(),
  lineItems: z.array(lineItemSchema).min(1, "At least one line item is required"),
  taxRate: z.string().optional(),
})

type InvoiceFormData = z.infer<typeof invoiceSchema>
type LineItem = z.infer<typeof lineItemSchema>

const PAYMENT_TERMS_OPTIONS = [
  { id: "due_on_receipt", label: "Due on Receipt" },
  { id: "net_15", label: "Net 15" },
  { id: "net_30", label: "Net 30" },
  { id: "net_60", label: "Net 60" },
]

interface CreateInvoiceFormProps {
  client: Client
  organizationId: string
  organizationSlug: string
}

export function CreateInvoiceForm({ client, organizationId, organizationSlug }: CreateInvoiceFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      issueDate: new Date().toISOString().split('T')[0],
      paymentTerms: "net_30",
      lineItems: [{ description: "", quantity: "1", rate: "" }],
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  })

  // Watch line items for calculations
  const lineItems = watch("lineItems")
  const taxRate = watch("taxRate")

  // Calculate totals
  const subtotal = lineItems?.reduce((sum, item) => {
    const quantity = parseFloat(item.quantity) || 0
    const rate = parseFloat(item.rate) || 0
    return sum + (quantity * rate)
  }, 0)

  const taxAmount = taxRate ? (subtotal * (parseFloat(taxRate) / 100)) : 0
  const total = subtotal + taxAmount

  async function onSubmit(data: InvoiceFormData) {
    setIsLoading(true)
    try {
      await createInvoice({
        value: total, 
        description: data.lineItems.map(item => item.description).join("\n"),
        customerId: client.id,
        organizationId,
        organizationSlug,
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        paymentTerms: data.paymentTerms,
        notes: data.notes,
        lineItems: data.lineItems,
        taxRate: data.taxRate ? parseFloat(data.taxRate) : null,
        status: "pending"
      })

      toast.success("Invoice created successfully")
      router.push(`/${organizationSlug}/clients/${client.id}`)
      router.refresh()
    } catch (error) {
      toast.error("Failed to create invoice")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Dates and Terms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Issue Date</label>
                <Input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  {...register("issueDate")}
                />
                {errors.issueDate && (
                  <p className="text-sm text-red-500">{errors.issueDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date</label>
                <Input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  {...register("dueDate")}
                />
                {errors.dueDate && (
                  <p className="text-sm text-red-500">{errors.dueDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Terms</label>
                <Select 
                  onValueChange={(value) => {
                    const form = document.querySelector('form')
                    const input = form?.querySelector(`input[name="paymentTerms"]`) as HTMLInputElement
                    if (input) {
                      input.value = value
                      input.dispatchEvent(new Event('input', { bubbles: true }))
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select terms" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_TERMS_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("paymentTerms")} />
                {errors.paymentTerms && (
                  <p className="text-sm text-red-500">{errors.paymentTerms.message}</p>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-4">
              <div className="font-medium">Line Items</div>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-6">
                      <Input
                        placeholder="Description"
                        {...register(`lineItems.${index}.description`)}
                      />
                      {errors.lineItems?.[index]?.description && (
                        <p className="text-sm text-red-500">
                          {errors.lineItems[index]?.description?.message}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Quantity"
                        {...register(`lineItems.${index}.quantity`)}
                      />
                      {errors.lineItems?.[index]?.quantity && (
                        <p className="text-sm text-red-500">
                          {errors.lineItems[index]?.quantity?.message}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Rate"
                        {...register(`lineItems.${index}.rate`)}
                      />
                      {errors.lineItems?.[index]?.rate && (
                        <p className="text-sm text-red-500">
                          {errors.lineItems[index]?.rate?.message}
                        </p>
                      )}
                    </div>
                    <div className="col-span-1 text-right pt-2">
                      ${((parseFloat(lineItems[index]?.quantity || "0") * 
                          parseFloat(lineItems[index]?.rate || "0")) || 0).toFixed(2)}
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ description: "", quantity: "1", rate: "" })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Line Item
              </Button>
            </div>

            {/* Totals */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Tax %"
                    {...register("taxRate")}
                  />
                </div>
                <span>Tax Amount: ${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                placeholder="Add any notes or payment instructions..."
                {...register("notes")}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Invoice"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 