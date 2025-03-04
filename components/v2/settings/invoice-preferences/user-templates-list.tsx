import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2, Check, MoreVertical, FileText } from "lucide-react"
import { InvoiceTemplate } from "../invoice-preferences-settings"
import { deleteInvoiceTemplate, updateInvoiceTemplate } from "@/app/actions/invoice-templates"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserTemplatesListProps {
  templates: InvoiceTemplate[]
  onPreview: (content: string) => void
  onEdit: (template: InvoiceTemplate) => void
  organization: any
  organizationSlug: string
  loadUserTemplates: () => Promise<void>
}

export function UserTemplatesList({ 
  templates, 
  onPreview, 
  onEdit, 
  organization, 
  organizationSlug, 
  loadUserTemplates 
}: UserTemplatesListProps) {
  
  const handleDeleteTemplate = async (id: string) => {
    try {
      await deleteInvoiceTemplate(id, organization.id, organizationSlug)
      await loadUserTemplates()
      toast.success("Template deleted successfully")
    } catch (error) {
      toast.error("Failed to delete template")
      console.error(error)
    }
  }
  
  const handleSetDefaultTemplate = async (template: Pick<InvoiceTemplate, 'id' | 'name' | 'description' | 'content' | 'isDefault' | 'category'>) => {
    try {
      await updateInvoiceTemplate({
        id: template.id,
        name: template.name,
        description: template.description,
        content: template.content,
        isDefault: true,
        category: template.category,
        organizationId: organization.id,
        organizationSlug,
      })
      
      await loadUserTemplates()
      toast.success(`${template.name} set as default template`)
    } catch (error) {
      toast.error("Failed to set default template")
      console.error(error)
    }
  }
  
  if (templates.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p>No templates created yet. Create your first invoice template to get started.</p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {templates.map((template) => (
        <Card key={template.id} className="group relative dark:bg-inherit dark:border-primary/10">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  {template.name}
                  {template.isDefault && (
                    <Badge variant="secondary" className="text-xs">Default</Badge>
                  )}
                </CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onPreview(template.content)}>
                    <Eye className="h-4 w-4 mr-2" /> Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(template)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  {!template.isDefault && (
                    <DropdownMenuItem onClick={() => handleSetDefaultTemplate(template)}>
                      <Check className="h-4 w-4 mr-2" /> Set as Default
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {template.description || "No description provided"}
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
        </Card>
      ))}
    </div>
  )
} 