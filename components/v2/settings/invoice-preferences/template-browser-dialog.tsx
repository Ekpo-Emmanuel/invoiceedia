import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Copy, Search, X, FileText } from "lucide-react"
import { predefinedTemplates, templateCategories } from "../invoice-preferences-settings"
import { createInvoiceTemplate } from "@/app/actions/invoice-templates"
import { toast } from "sonner"
import { useEffect, useState, useRef, useCallback } from "react"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"

// Custom hook for media queries
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

// Custom hook for debouncing values
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface TemplateBrowserDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  browsePredefinedTemplates: typeof predefinedTemplates
  setBrowsePredefinedTemplates: (templates: typeof predefinedTemplates) => void
  handlePreviewTemplate: (content: string) => void
  organization: any
  organizationSlug: string
  loadUserTemplates: () => Promise<void>
}

export function TemplateBrowserDialog({
  isOpen,
  setIsOpen,
  searchQuery: externalSearchQuery,
  setSearchQuery: setExternalSearchQuery,
  selectedCategory,
  setSelectedCategory,
  browsePredefinedTemplates,
  setBrowsePredefinedTemplates,
  handlePreviewTemplate,
  organization,
  organizationSlug,
  loadUserTemplates
}: TemplateBrowserDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Use local state for search to prevent focus issues
  const [localSearchQuery, setLocalSearchQuery] = useState(externalSearchQuery);
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);
  
  // Sync local search with external search
  useEffect(() => {
    setExternalSearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery, setExternalSearchQuery]);
  
  // Sync external search with local search when dialog opens
  useEffect(() => {
    if (isOpen) {
      setLocalSearchQuery(externalSearchQuery);
    }
  }, [isOpen, externalSearchQuery]);
  
  // Reset filters when dialog opens
  useEffect(() => {
    if (isOpen) {
      // Reset to initial state when dialog opens
      setBrowsePredefinedTemplates([...predefinedTemplates]);
      
      // Apply initial filters
      const filtered = predefinedTemplates.filter(template => {
        const matchesSearch = !externalSearchQuery || 
          template.name.toLowerCase().includes(externalSearchQuery.toLowerCase()) ||
          (template.description?.toLowerCase() || "").includes(externalSearchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });
      
      setBrowsePredefinedTemplates(filtered);
    }
  }, [isOpen]);
  
  // Apply filters when search or category changes
  useEffect(() => {
    if (isOpen) {
      const filtered = predefinedTemplates.filter(template => {
        const matchesSearch = !externalSearchQuery || 
          template.name.toLowerCase().includes(externalSearchQuery.toLowerCase()) ||
          (template.description?.toLowerCase() || "").includes(externalSearchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });
      
      setBrowsePredefinedTemplates(filtered);
    }
  }, [externalSearchQuery, selectedCategory, isOpen]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update local state directly
    setLocalSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  const clearSearch = () => {
    setLocalSearchQuery("");
  };
  
  const handleAddPredefinedTemplate = async (template: typeof predefinedTemplates[0]) => {
    try {
      await createInvoiceTemplate({
        name: `${template.name} Template`,
        description: template.description,
        content: template.content,
        isDefault: false,
        category: template.category,
        organizationId: organization.id,
        organizationSlug,
      });

      await loadUserTemplates();
      setIsOpen(false);
      toast.success(`${template.name} template added successfully`);
    } catch (error) {
      toast.error("Failed to add template");
      console.error(error);
    }
  };

  // Shared content between Dialog and Drawer
  const TemplateContent = () => (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-4">
        <div className="relative sm:flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={localSearchQuery}
            onChange={handleSearch}
            className="pl-8"
            autoFocus
          />
          {localSearchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7 w-7 p-0"
              onClick={clearSearch}
              tabIndex={-1}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {templateCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full border rounded-md overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {browsePredefinedTemplates.map((template) => (
                <Card key={template.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {templateCategories.find(c => c.id === template.category)?.name}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {template.description}
                    </p>
                    <div 
                      className="bg-muted rounded-md h-24 flex items-center justify-center text-muted-foreground text-xs cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handlePreviewTemplate(template.content)}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>Click to preview</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end pt-2">
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
              
              {browsePredefinedTemplates.length === 0 && (
                <div className="col-span-2 py-8 text-center text-muted-foreground">
                  No templates found matching your search criteria.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
  
  // Render either Dialog or Drawer based on screen size
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="p-4 max-h-[90vh] h-[90vh]">
          <DrawerHeader className="px-0">
            <DrawerTitle>Browse Templates</DrawerTitle>
            <DrawerDescription>
              Search and filter through our collection of professional invoice templates.
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="flex flex-col h-[calc(90vh-140px)]">
            <TemplateContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl h-[90vh] p-6 flex flex-col">
        <DialogHeader>
          <DialogTitle>Browse Templates</DialogTitle>
          <DialogDescription>
            Search and filter through our collection of professional invoice templates.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col flex-1 h-[calc(90vh-180px)]">
          <TemplateContent />
        </div>
      </DialogContent>
    </Dialog>
  );
} 