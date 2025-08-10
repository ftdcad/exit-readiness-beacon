
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, Circle, Filter, Plus, Info } from 'lucide-react';
import { ChecklistCategory, ChecklistItem, getChecklistStats } from '@/lib/checklists/defaultDueDiligenceChecklist';

interface ChecklistSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checklist: ChecklistCategory[];
  onUpdateChecklist: (checklist: ChecklistCategory[]) => void;
}

type PriorityFilter = 'All' | 'Critical' | 'Important' | 'Nice to Have';
type IndustryFilter = 'All' | 'General' | 'Healthcare' | 'Manufacturing' | 'SaaS' | 'Government/Defense';

export const ChecklistSheet: React.FC<ChecklistSheetProps> = ({
  open,
  onOpenChange,
  checklist,
  onUpdateChecklist
}) => {
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('All');
  const [industryFilter, setIndustryFilter] = useState<IndustryFilter>('All');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['corporate', 'financial']);

  const stats = getChecklistStats(checklist);

  const toggleItemCompletion = (categoryId: string, itemId: string) => {
    const updatedChecklist = checklist.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map(item => {
            if (item.id === itemId) {
              return { ...item, completed: !item.completed };
            }
            return item;
          })
        };
      }
      return category;
    });
    onUpdateChecklist(updatedChecklist);
  };

  const filteredChecklist = checklist.map(category => ({
    ...category,
    items: category.items.filter(item => {
      const priorityMatch = priorityFilter === 'All' || item.priority === priorityFilter;
      const industryMatch = industryFilter === 'All' || item.industry === industryFilter || item.industry === 'General';
      return priorityMatch && industryMatch;
    })
  })).filter(category => category.items.length > 0);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'Important': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Nice to Have': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>Due Diligence Checklist</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 py-4">
          {/* Progress Overview */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.completionPercentage}%</div>
                <div className="text-sm text-muted-foreground">Overall Complete</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stats.completedItems} of {stats.totalItems} items
                </div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.criticalPercentage}%</div>
                <div className="text-sm text-muted-foreground">Critical Items</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stats.completedCritical} of {stats.criticalItems} critical
                </div>
              </div>
            </div>
            <Progress value={stats.completionPercentage} className="h-2" />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={priorityFilter} onValueChange={(value: PriorityFilter) => setPriorityFilter(value)}>
              <SelectTrigger className="w-32">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priority</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="Important">Important</SelectItem>
                <SelectItem value="Nice to Have">Nice to Have</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={industryFilter} onValueChange={(value: IndustryFilter) => setIndustryFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Industries</SelectItem>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="SaaS">SaaS/Tech</SelectItem>
                <SelectItem value="Government/Defense">Gov/Defense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Checklist Items */}
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            <Accordion 
              type="multiple" 
              value={expandedCategories}
              onValueChange={setExpandedCategories}
              className="space-y-2"
            >
              {filteredChecklist.map(category => {
                const categoryStats = getChecklistStats([category]);
                return (
                  <AccordionItem key={category.id} value={category.id} className="border rounded-lg">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex items-center justify-between w-full mr-4">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{category.name}</span>
                          {categoryStats.completionPercentage === 100 && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {categoryStats.completedItems}/{categoryStats.totalItems}
                          </span>
                          <div className="w-16">
                            <Progress value={categoryStats.completionPercentage} className="h-1" />
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3">
                        {category.items.map(item => (
                          <div 
                            key={item.id}
                            className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                              item.completed ? 'bg-green-50 border-green-200' : 'bg-background border-border'
                            }`}
                          >
                            <Checkbox
                              checked={item.completed}
                              onCheckedChange={() => toggleItemCompletion(category.id, item.id)}
                              className="mt-0.5"
                            />
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className={`font-medium text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                                  {item.title}
                                </h4>
                                <Badge variant="outline" className={`text-xs ${getPriorityColor(item.priority)}`}>
                                  {item.priority}
                                </Badge>
                              </div>
                              {item.description && (
                                <p className={`text-xs text-muted-foreground ${item.completed ? 'line-through' : ''}`}>
                                  {item.description}
                                </p>
                              )}
                              {item.folderRef && (
                                <div className="flex items-center gap-1 text-xs text-blue-600">
                                  <Info className="w-3 h-3" />
                                  <span>Upload to: {item.folderRef}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" size="sm" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Export Checklist
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
