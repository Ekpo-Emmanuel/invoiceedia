import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { UserTemplatesList } from "./user-templates-list"
import { PredefinedTemplatesList } from "./predefined-templates-list"
import { InvoiceTemplate } from "../invoice-preferences-settings"

interface TemplatesTabProps {
  invoiceTemplates: InvoiceTemplate[]
  setIsTemplateDialogOpen: (open: boolean) => void
  setCurrentTemplate: (template: InvoiceTemplate | null) => void
  setTemplateName: (name: string) => void
  setTemplateDescription: (description: string) => void
  setTemplateContent: (content: string) => void
  handlePreviewTemplate: (content: string) => void
  setIsTemplatesBrowserOpen?: (open: boolean) => void
  handleOpenTemplateBrowser?: () => void
  organization: any
  organizationSlug: string
  loadUserTemplates: () => Promise<void>
}

export function TemplatesTab({
  invoiceTemplates,
  setIsTemplateDialogOpen,
  setCurrentTemplate,
  setTemplateName,
  setTemplateDescription,
  setTemplateContent,
  handlePreviewTemplate,
  setIsTemplatesBrowserOpen,
  handleOpenTemplateBrowser,
  organization,
  organizationSlug,
  loadUserTemplates
}: TemplatesTabProps) {
  
  const handleOpenAddTemplateDialog = () => {
    setCurrentTemplate(null)
    setTemplateName("")
    setTemplateDescription("")
    setTemplateContent("")
    setIsTemplateDialogOpen(true)
  }
  
  const handleEditTemplate = (template: InvoiceTemplate) => {
    setCurrentTemplate(template)
    setTemplateName(template.name)
    setTemplateDescription(template.description || "")
    setTemplateContent(template.content)
    setIsTemplateDialogOpen(true)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Invoice Templates</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={handleOpenAddTemplateDialog}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Template
        </Button>
      </div>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-3">Your Templates</h4>
          <UserTemplatesList 
            templates={invoiceTemplates}
            onPreview={handlePreviewTemplate}
            onEdit={handleEditTemplate}
            organization={organization}
            organizationSlug={organizationSlug}
            loadUserTemplates={loadUserTemplates}
          />
        </div>
        
        <Separator />
        
        <PredefinedTemplatesList 
          onPreview={handlePreviewTemplate}
          onBrowseAll={handleOpenTemplateBrowser || (() => setIsTemplatesBrowserOpen?.(true))}
          organization={organization}
          organizationSlug={organizationSlug}
          loadUserTemplates={loadUserTemplates}
          invoiceTemplatesCount={invoiceTemplates.length}
        />
      </div>
    </div>
  )
} 