"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getInvoiceTemplates } from "@/app/actions/invoice-templates"

// Import sub-components
import { GeneralSettingsTab } from "./invoice-preferences/general-settings-tab"
import { TemplatesTab } from "./invoice-preferences/templates-tab"
import { TemplateFormDialog } from "./invoice-preferences/template-form-dialog"
import { TemplateBrowserDialog } from "./invoice-preferences/template-browser-dialog"
import { TemplatePreviewDialog } from "./invoice-preferences/template-preview-dialog"

// Types
interface InvoicePreferencesSettingsProps {
  organization: any;
  organizationSlug: string;
}

interface InvoiceTemplate {
  id: string;
  name: string;
  description: string | null;
  content: string;
  isDefault: boolean;
  category: string;
  userId: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Form schema
const formSchema = z.object({
  invoicePrefix: z.string().min(1, {
    message: "Invoice prefix is required.",
  }),
  paymentTerms: z.enum(["due_on_receipt", "net_7", "net_15", "net_30", "net_60"]),
  currency: z.string().min(1, {
    message: "Currency is required.",
  }),
  enableTax: z.boolean(),
  enableDiscount: z.boolean(),
  defaultTaxRate: z.string().optional(),
  invoiceTemplates: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    content: z.string(),
    isDefault: z.boolean(),
    category: z.string(),
    userId: z.string(),
    organizationId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
  })),
})

export default function InvoicePreferencesSettings({ organization, organizationSlug }: InvoicePreferencesSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState<InvoiceTemplate | null>(null)
  const [templateName, setTemplateName] = useState("")
  const [templateDescription, setTemplateDescription] = useState("")
  const [templateContent, setTemplateContent] = useState("")
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [isTemplatesBrowserOpen, setIsTemplatesBrowserOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [browsePredefinedTemplates, setBrowsePredefinedTemplates] = useState<typeof predefinedTemplates>([...predefinedTemplates])
  const [userTemplates, setUserTemplates] = useState<InvoiceTemplate[]>([])

  useEffect(() => {
    loadUserTemplates()
  }, [])

  const loadUserTemplates = async () => {
    try {
      const templates = await getInvoiceTemplates(organization.id)
      setUserTemplates(templates)
      form.setValue("invoiceTemplates", templates)
    } catch (error) {
      console.error("Error loading templates:", error)
      toast.error("Failed to load invoice templates")
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoicePrefix: organization.invoicePrefix || "INV-",
      paymentTerms: organization.paymentTerms || "net_30",
      currency: organization.currency || "USD",
      enableTax: organization.enableTax || false,
      enableDiscount: organization.enableDiscount || false,
      defaultTaxRate: organization.defaultTaxRate?.toString() || "",
      invoiceTemplates: [],
    },
  })

  const watchEnableTax = form.watch("enableTax")
  const invoiceTemplates = form.watch("invoiceTemplates")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // TODO: Implement the API call to update invoice preferences
      console.log(values)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Invoice preferences updated successfully")
    } catch (error) {
      toast.error("Failed to update invoice preferences")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetTemplateForm = () => {
    setCurrentTemplate(null)
    setTemplateName("")
    setTemplateDescription("")
    setTemplateContent("")
  }

  // Reset template browser state when it opens
  const handleOpenTemplateBrowser = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setBrowsePredefinedTemplates([...predefinedTemplates])
    setIsTemplatesBrowserOpen(true)
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="">
            <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
              <TabsTrigger value="general">General Settings</TabsTrigger>
              <TabsTrigger value="templates">Invoice Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6 pt-4">
              <GeneralSettingsTab 
                form={form} 
                watchEnableTax={watchEnableTax} 
              />
            </TabsContent>
            
            <TabsContent value="templates" className="space-y-6 pt-4">
              <TemplatesTab 
                invoiceTemplates={invoiceTemplates}
                setIsTemplateDialogOpen={setIsTemplateDialogOpen}
                setCurrentTemplate={setCurrentTemplate}
                setTemplateName={setTemplateName}
                setTemplateDescription={setTemplateDescription}
                setTemplateContent={setTemplateContent}
                handlePreviewTemplate={setPreviewTemplate}
                setIsTemplatesBrowserOpen={setIsTemplatesBrowserOpen}
                handleOpenTemplateBrowser={handleOpenTemplateBrowser}
                organization={organization}
                organizationSlug={organizationSlug}
                loadUserTemplates={loadUserTemplates}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>

      <TemplateFormDialog 
        isOpen={isTemplateDialogOpen}
        setIsOpen={setIsTemplateDialogOpen}
        currentTemplate={currentTemplate}
        templateName={templateName}
        setTemplateName={setTemplateName}
        templateDescription={templateDescription}
        setTemplateDescription={setTemplateDescription}
        templateContent={templateContent}
        setTemplateContent={setTemplateContent}
        invoiceTemplates={invoiceTemplates}
        organization={organization}
        organizationSlug={organizationSlug}
        loadUserTemplates={loadUserTemplates}
        resetTemplateForm={resetTemplateForm}
      />
      
      <TemplatePreviewDialog 
        previewTemplate={previewTemplate}
        closePreview={() => setPreviewTemplate(null)}
      />

      <TemplateBrowserDialog 
        isOpen={isTemplatesBrowserOpen}
        setIsOpen={setIsTemplatesBrowserOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        browsePredefinedTemplates={browsePredefinedTemplates}
        setBrowsePredefinedTemplates={setBrowsePredefinedTemplates}
        handlePreviewTemplate={setPreviewTemplate}
        organization={organization}
        organizationSlug={organizationSlug}
        loadUserTemplates={loadUserTemplates}
      />
    </div>
  )
}

// Export constants and types for use in sub-components
export const currencies = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "CNY", label: "CNY - Chinese Yuan" },
  { value: "INR", label: "INR - Indian Rupee" },
]

export const templateCategories = [
  { id: 'all', name: 'All Templates' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'professional', name: 'Professional' },
  { id: 'creative', name: 'Creative' },
  { id: 'modern', name: 'Modern' },
  { id: 'industry', name: 'Industry-Specific' },
];

export const predefinedTemplates = [
  {
    id: "minimal",
    name: "Minimal",
    description: "A clean, simple invoice template with minimal styling",
    thumbnail: "minimal-template.png",
    category: "minimal",
    content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice {{invoice_number}}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 40px; color: #333; }
    .invoice-header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .invoice-title { font-size: 28px; font-weight: bold; margin-bottom: 5px; }
    .invoice-details { margin-bottom: 30px; }
    .invoice-details div { margin-bottom: 5px; }
    .client-details { margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { text-align: left; padding: 10px; border-bottom: 1px solid #ddd; }
    td { padding: 10px; border-bottom: 1px solid #eee; }
    .totals { margin-left: auto; width: 300px; }
    .totals table { margin-bottom: 0; }
    .notes { margin-top: 30px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="invoice-header">
    <div>
      <div class="invoice-title">INVOICE</div>
      <div>{{business_name}}</div>
    </div>
    <div>
      <img src="{{logo_url}}" alt="Logo" style="max-height: 80px;">
    </div>
  </div>
  
  <div class="invoice-details">
    <div><strong>Invoice Number:</strong> {{invoice_number}}</div>
    <div><strong>Issue Date:</strong> {{issue_date}}</div>
    <div><strong>Due Date:</strong> {{due_date}}</div>
  </div>
  
  <div class="client-details">
    <div><strong>Bill To:</strong></div>
    <div>{{client_name}}</div>
    <div>{{client_email}}</div>
    <div>{{client_address}}</div>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Quantity</th>
        <th>Rate</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      {{#line_items}}
      <tr>
        <td>{{description}}</td>
        <td>{{quantity}}</td>
        <td>{{currency_symbol}}{{rate}}</td>
        <td>{{currency_symbol}}{{amount}}</td>
      </tr>
      {{/line_items}}
    </tbody>
  </table>
  
  <div class="totals">
    <table>
      <tr>
        <td><strong>Subtotal</strong></td>
        <td>{{currency_symbol}}{{subtotal}}</td>
      </tr>
      {{#tax}}
      <tr>
        <td><strong>Tax ({{tax_rate}}%)</strong></td>
        <td>{{currency_symbol}}{{tax_amount}}</td>
      </tr>
      {{/tax}}
      <tr>
        <td><strong>Total</strong></td>
        <td><strong>{{currency_symbol}}{{total}}</strong></td>
      </tr>
    </table>
  </div>
  
  <div class="notes">
    <strong>Notes:</strong>
    <p>{{notes}}</p>
  </div>
</body>
</html>`
  },
  {
    id: "professional",
    name: "Professional",
    description: "A professional business invoice with a modern design",
    thumbnail: "professional-template.png",
    category: "professional",
    content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice {{invoice_number}}</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; color: #333; background-color: #f9f9f9; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px; background-color: white; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
    .invoice-header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .invoice-title { font-size: 28px; font-weight: 300; color: #2c3e50; margin-bottom: 5px; }
    .invoice-id { color: #7f8c8d; font-size: 16px; }
    .invoice-details { margin-bottom: 30px; }
    .invoice-details div { margin-bottom: 5px; }
    .client-details { margin-bottom: 30px; }
    .section-title { font-size: 18px; font-weight: 600; margin-bottom: 10px; color: #2c3e50; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { text-align: left; padding: 12px; background-color: #f5f5f5; border-bottom: 2px solid #ddd; font-weight: 600; }
    td { padding: 12px; border-bottom: 1px solid #eee; }
    .totals { margin-left: auto; width: 300px; }
    .totals table { margin-bottom: 0; }
    .totals table td { padding: 8px 12px; }
    .total-row { font-weight: bold; font-size: 18px; background-color: #f5f5f5; }
    .notes { margin-top: 30px; font-size: 14px; color: #7f8c8d; padding: 15px; background-color: #f9f9f9; border-radius: 4px; }
    .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #7f8c8d; }
  </style>
</head>
<body>
  <div class="container">
    <div class="invoice-header">
      <div>
        <div class="invoice-title">INVOICE</div>
        <div class="invoice-id">{{invoice_number}}</div>
      </div>
      <div>
        <img src="{{logo_url}}" alt="Logo" style="max-height: 80px;">
      </div>
    </div>
    
    <div class="row">
      <div class="col">
        <div class="section-title">From</div>
        <div>{{business_name}}</div>
        <div>{{business_email}}</div>
        <div>{{business_address}}</div>
      </div>
      <div class="col">
        <div class="section-title">To</div>
        <div>{{client_name}}</div>
        <div>{{client_email}}</div>
        <div>{{client_address}}</div>
      </div>
      <div class="col">
        <div class="section-title">Details</div>
        <div><strong>Invoice Date:</strong> {{issue_date}}</div>
        <div><strong>Due Date:</strong> {{due_date}}</div>
        <div><strong>Payment Terms:</strong> {{payment_terms}}</div>
      </div>
    </div>
    
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Quantity</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {{#line_items}}
        <tr>
          <td>{{description}}</td>
          <td>{{quantity}}</td>
          <td>{{currency_symbol}}{{rate}}</td>
          <td>{{currency_symbol}}{{amount}}</td>
        </tr>
        {{/line_items}}
      </tbody>
    </table>
    
    <div class="totals">
      <table>
        <tr>
          <td>Subtotal</td>
          <td>{{currency_symbol}}{{subtotal}}</td>
        </tr>
        {{#tax}}
        <tr>
          <td>Tax ({{tax_rate}}%)</td>
          <td>{{currency_symbol}}{{tax_amount}}</td>
        </tr>
        {{/tax}}
        <tr class="total-row">
          <td>Total</td>
          <td>{{currency_symbol}}{{total}}</td>
        </tr>
      </table>
    </div>
    
    <div class="notes">
      <div class="section-title">Notes</div>
      <p>{{notes}}</p>
    </div>
    
    <div class="footer">
      <p>Thank you for your business!</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: "creative",
    name: "Creative",
    description: "A colorful and creative invoice template for creative professionals",
    thumbnail: "creative-template.png",
    category: "creative",
    content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice {{invoice_number}}</title>
  <style>
    body { font-family: 'Montserrat', sans-serif; margin: 0; padding: 0; color: #333; background-color: #fff; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px; }
    .invoice-header { position: relative; padding: 30px; margin-bottom: 40px; background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); color: white; border-radius: 10px; }
    .invoice-title { font-size: 32px; font-weight: 700; margin-bottom: 5px; }
    .invoice-id { font-size: 18px; opacity: 0.8; }
    .logo { position: absolute; top: 30px; right: 30px; }
    .logo img { max-height: 80px; }
    .row { display: flex; flex-wrap: wrap; margin: 0 -15px; }
    .col { flex: 1; padding: 0 15px; min-width: 200px; }
    .card { background-color: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .section-title { font-size: 18px; font-weight: 600; margin-bottom: 15px; color: #6a11cb; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    th { text-align: left; padding: 15px; background-color: #f1f3f5; font-weight: 600; color: #495057; }
    td { padding: 15px; border-bottom: 1px solid #f1f3f5; }
    tr:last-child td { border-bottom: none; }
    .totals { margin-left: auto; width: 300px; }
    .totals table { margin-bottom: 0; }
    .total-row { font-weight: bold; font-size: 18px; background-color: #f8f9fa; }
    .notes { padding: 20px; background-color: #f8f9fa; border-radius: 10px; margin-top: 30px; }
    .footer { margin-top: 50px; text-align: center; font-size: 14px; color: #6c757d; }
    .accent { color: #6a11cb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="invoice-header">
      <div class="invoice-title">INVOICE</div>
      <div class="invoice-id">{{invoice_number}}</div>
      <div class="logo">
        <img src="{{logo_url}}" alt="Logo">
      </div>
    </div>
    
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="section-title">From</div>
          <div>{{business_name}}</div>
          <div>{{business_email}}</div>
          <div>{{business_address}}</div>
        </div>
      </div>
      <div class="col">
        <div class="card">
          <div class="section-title">To</div>
          <div>{{client_name}}</div>
          <div>{{client_email}}</div>
          <div>{{client_address}}</div>
        </div>
      </div>
      <div class="col">
        <div class="card">
          <div class="section-title">Details</div>
          <div><strong>Issue Date:</strong> {{issue_date}}</div>
          <div><strong>Due Date:</strong> <span class="accent">{{due_date}}</span></div>
          <div><strong>Payment Terms:</strong> {{payment_terms}}</div>
        </div>
      </div>
    </div>
    
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Quantity</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {{#line_items}}
        <tr>
          <td>{{description}}</td>
          <td>{{quantity}}</td>
          <td>{{currency_symbol}}{{rate}}</td>
          <td>{{currency_symbol}}{{amount}}</td>
        </tr>
        {{/line_items}}
      </tbody>
    </table>
    
    <div class="totals">
      <table>
        <tr>
          <td>Subtotal</td>
          <td>{{currency_symbol}}{{subtotal}}</td>
        </tr>
        {{#tax}}
        <tr>
          <td>Tax ({{tax_rate}}%)</td>
          <td>{{currency_symbol}}{{tax_amount}}</td>
        </tr>
        {{/tax}}
        <tr class="total-row">
          <td>Total</td>
          <td>{{currency_symbol}}{{total}}</td>
        </tr>
      </table>
    </div>
    
    <div class="notes">
      <div class="section-title">Notes</div>
      <p>{{notes}}</p>
    </div>
    
    <div class="footer">
      <p>Thank you for your business! <span class="accent">♥</span></p>
    </div>
  </div>
</body>
</html>`
  }
];

// Export types for use in sub-components
export type { InvoiceTemplate };
export { formSchema }; 