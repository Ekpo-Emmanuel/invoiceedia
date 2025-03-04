import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TemplatePreviewDialogProps {
  previewTemplate: string | null
  closePreview: () => void
}

export function TemplatePreviewDialog({ previewTemplate, closePreview }: TemplatePreviewDialogProps) {
  return (
    <Dialog open={previewTemplate !== null} onOpenChange={closePreview}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Template Preview</DialogTitle>
          <DialogDescription>
            This is how your invoice template will look with sample data.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[500px] w-full rounded-md border bg-white">
          <div className="">
            <iframe
              srcDoc={previewTemplate || ""}
              style={{ 
                width: "100%", 
                height: "500px", 
                border: "none",

             }}
              title="Template Preview"
            />
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button type="button" onClick={closePreview}>
            Close Preview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 