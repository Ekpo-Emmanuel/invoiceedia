import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Copy, ArrowRight, FileText } from "lucide-react"
import { predefinedTemplates } from "../invoice-preferences-settings"
import { createInvoiceTemplate } from "@/app/actions/invoice-templates"
import { toast } from "sonner"

interface PredefinedTemplatesListProps {
  onPreview: (content: string) => void
  onBrowseAll: () => void
  organization: any
  organizationSlug: string
  loadUserTemplates: () => Promise<void>
  invoiceTemplatesCount: number
}

export function PredefinedTemplatesList({ 
  onPreview, 
  onBrowseAll, 
  organization, 
  organizationSlug, 
  loadUserTemplates,
  invoiceTemplatesCount
}: PredefinedTemplatesListProps) {
  
  const handleAddPredefinedTemplate = async (template: typeof predefinedTemplates[0]) => {
    try {
      await createInvoiceTemplate({
        name: `${template.name} Template`,
        description: template.description,
        content: template.content,
        isDefault: invoiceTemplatesCount === 0,
        category: template.category,
        organizationId: organization.id,
        organizationSlug,
      })

      await loadUserTemplates()
      toast.success(`${template.name} template added successfully`)
    } catch (error) {
      toast.error("Failed to add template")
      console.error(error)
    }
  }
  
  // Show only the first 3 templates in the preview
  const previewTemplates = predefinedTemplates.slice(0, 3)
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between mb-4">
        <div>
          <h4 className="text-sm font-medium">Pre-defined Templates</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Choose from our pre-defined templates to get started quickly.
          </p>
        </div>
        <Button 
          type="button"
          variant="outline" 
          size="sm"
          onClick={onBrowseAll}
          className="flex items-center gap-1"
        >
          Browse All Templates <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {previewTemplates.map((template) => (
          <Card key={template.id} className="relative">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {template.description}
              </p>
              <div 
                className="bg-muted rounded-md h-24 flex items-center justify-center text-muted-foreground text-xs cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => onPreview(template.content)}
              >
                <div className="flex flex-col items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>Click to preview</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex pt-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handleAddPredefinedTemplate(template)}
                className="text-xs"
              >
                <Copy className="h-3 w-3 mr-1" /> Use Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
} 