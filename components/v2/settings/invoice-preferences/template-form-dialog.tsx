import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { createInvoiceTemplate, updateInvoiceTemplate } from "@/app/actions/invoice-templates"
import { InvoiceTemplate } from "../invoice-preferences-settings"

interface TemplateFormDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  currentTemplate: InvoiceTemplate | null
  templateName: string
  setTemplateName: (name: string) => void
  templateDescription: string
  setTemplateDescription: (description: string) => void
  templateContent: string
  setTemplateContent: (content: string) => void
  invoiceTemplates: InvoiceTemplate[]
  organization: any
  organizationSlug: string
  loadUserTemplates: () => Promise<void>
  resetTemplateForm: () => void
}

export function TemplateFormDialog({
  isOpen,
  setIsOpen,
  currentTemplate,
  templateName,
  setTemplateName,
  templateDescription,
  setTemplateDescription,
  templateContent,
  setTemplateContent,
  invoiceTemplates,
  organization,
  organizationSlug,
  loadUserTemplates,
  resetTemplateForm
}: TemplateFormDialogProps) {
  
  const handleAddTemplate = async () => {
    if (!templateName.trim()) {
      toast.error("Template name is required")
      return
    }

    try {
      await createInvoiceTemplate({
        name: templateName,
        description: templateDescription,
        content: templateContent,
        isDefault: invoiceTemplates.length === 0,
        category: "custom",
        organizationId: organization.id,
        organizationSlug,
      })

      await loadUserTemplates()
      resetTemplateForm()
      setIsOpen(false)
      toast.success("Template added successfully")
    } catch (error) {
      toast.error("Failed to add template")
      console.error(error)
    }
  }

  const handleEditTemplate = async () => {
    if (!currentTemplate) return
    if (!templateName.trim()) {
      toast.error("Template name is required")
      return
    }

    try {
      await updateInvoiceTemplate({
        id: currentTemplate.id,
        name: templateName,
        description: templateDescription,
        content: templateContent,
        isDefault: currentTemplate.isDefault,
        category: currentTemplate.category,
        organizationId: organization.id,
        organizationSlug,
      })

      await loadUserTemplates()
      resetTemplateForm()
      setIsOpen(false)
      toast.success("Template updated successfully")
    } catch (error) {
      toast.error("Failed to update template")
      console.error(error)
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{currentTemplate ? "Edit Template" : "Create New Template"}</DialogTitle>
          <DialogDescription>
            {currentTemplate 
              ? "Update your invoice template details below." 
              : "Create a new invoice template to use when generating invoices."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="templateName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Template Name
            </label>
            <Input
              id="templateName"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., Standard Invoice, Professional Template"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="templateDescription" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Description (Optional)
            </label>
            <Input
              id="templateDescription"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              placeholder="Brief description of this template"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="templateContent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Template Content
            </label>
            <ScrollArea className="h-[200px] rounded-md border">
              <Textarea
                id="templateContent"
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                placeholder="Enter HTML or markdown content for your invoice template"
                className="min-h-[200px] border-0"
              />
            </ScrollArea>
            <p className="text-xs text-muted-foreground">
              You can use HTML or markdown to format your invoice template. Available variables: &#123;&#123;company_name&#125;&#125;, &#123;&#123;invoice_number&#125;&#125;, &#123;&#123;client_name&#125;&#125;, etc.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={currentTemplate ? handleEditTemplate : handleAddTemplate}
          >
            {currentTemplate ? "Update Template" : "Add Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 