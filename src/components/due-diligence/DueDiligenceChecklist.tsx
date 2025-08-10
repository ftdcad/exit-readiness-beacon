
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, Filter, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  assignee?: string;
  dueDate?: string;
  notes?: string;
}

const defaultChecklist: ChecklistItem[] = [
  // Financial Documents
  { id: '1', category: 'Financial Documents', item: 'Audited Financial Statements (3-5 years)', status: 'pending', priority: 'high' },
  { id: '2', category: 'Financial Documents', item: 'Monthly Financial Statements (Current Year)', status: 'pending', priority: 'high' },
  { id: '3', category: 'Financial Documents', item: 'Tax Returns (3-5 years)', status: 'pending', priority: 'high' },
  { id: '4', category: 'Financial Documents', item: 'Management Letter from Auditors', status: 'pending', priority: 'medium' },
  { id: '5', category: 'Financial Documents', item: 'Budget vs Actual Reports', status: 'pending', priority: 'medium' },
  { id: '6', category: 'Financial Documents', item: 'Cash Flow Statements', status: 'pending', priority: 'high' },
  { id: '7', category: 'Financial Documents', item: 'Accounts Receivable Aging', status: 'pending', priority: 'medium' },
  { id: '8', category: 'Financial Documents', item: 'Accounts Payable Summary', status: 'pending', priority: 'medium' },
  
  // Legal & Corporate
  { id: '9', category: 'Legal & Corporate', item: 'Articles of Incorporation', status: 'pending', priority: 'high' },
  { id: '10', category: 'Legal & Corporate', item: 'Corporate Bylaws', status: 'pending', priority: 'high' },
  { id: '11', category: 'Legal & Corporate', item: 'Stock Records & Cap Table', status: 'pending', priority: 'high' },
  { id: '12', category: 'Legal & Corporate', item: 'Board Meeting Minutes', status: 'pending', priority: 'medium' },
  { id: '13', category: 'Legal & Corporate', item: 'Material Contracts & Agreements', status: 'pending', priority: 'high' },
  { id: '14', category: 'Legal & Corporate', item: 'Litigation History & Status', status: 'pending', priority: 'high' },
  { id: '15', category: 'Legal & Corporate', item: 'Insurance Policies', status: 'pending', priority: 'medium' },
  { id: '16', category: 'Legal & Corporate', item: 'Intellectual Property Documentation', status: 'pending', priority: 'medium' },
  
  // Operations
  { id: '17', category: 'Operations', item: 'Organizational Chart', status: 'pending', priority: 'medium' },
  { id: '18', category: 'Operations', item: 'Key Employee Contracts', status: 'pending', priority: 'high' },
  { id: '19', category: 'Operations', item: 'Employee Handbook & Policies', status: 'pending', priority: 'low' },
  { id: '20', category: 'Operations', item: 'Benefit Plans & Administration', status: 'pending', priority: 'medium' },
  { id: '21', category: 'Operations', item: 'Customer List & Contracts', status: 'pending', priority: 'high' },
  { id: '22', category: 'Operations', item: 'Supplier/Vendor Agreements', status: 'pending', priority: 'medium' },
  { id: '23', category: 'Operations', item: 'Operating Procedures Manual', status: 'pending', priority: 'low' },
  { id: '24', category: 'Operations', item: 'Quality Control Documentation', status: 'pending', priority: 'medium' },
  
  // Technology & IP
  { id: '25', category: 'Technology & IP', item: 'IT Infrastructure Assessment', status: 'pending', priority: 'medium' },
  { id: '26', category: 'Technology & IP', item: 'Software Licenses & Agreements', status: 'pending', priority: 'medium' },
  { id: '27', category: 'Technology & IP', item: 'Data Security & Privacy Policies', status: 'pending', priority: 'high' },
  { id: '28', category: 'Technology & IP', item: 'Cybersecurity Assessment', status: 'pending', priority: 'high' },
  { id: '29', category: 'Technology & IP', item: 'Patent & Trademark Portfolio', status: 'pending', priority: 'medium' },
  
  // Regulatory & Compliance
  { id: '30', category: 'Regulatory & Compliance', item: 'Business Licenses & Permits', status: 'pending', priority: 'high' },
  { id: '31', category: 'Regulatory & Compliance', item: 'Environmental Compliance', status: 'pending', priority: 'medium' },
  { id: '32', category: 'Regulatory & Compliance', item: 'Industry Regulatory Filings', status: 'pending', priority: 'medium' },
  { id: '33', category: 'Regulatory & Compliance', item: 'Employment Law Compliance', status: 'pending', priority: 'medium' },
  { id: '34', category: 'Regulatory & Compliance', item: 'Health & Safety Records', status: 'pending', priority: 'medium' },
];

export const DueDiligenceChecklist: React.FC = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(defaultChecklist);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dd-checklist');
    if (saved) {
      try {
        setChecklist(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading checklist from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever checklist changes
  useEffect(() => {
    localStorage.setItem('dd-checklist', JSON.stringify(checklist));
  }, [checklist]);

  const categories = Array.from(new Set(checklist.map(item => item.category)));
  
  const filteredItems = checklist.filter(item => {
    const matchesSearch = item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const updateItemStatus = (id: string, status: ChecklistItem['status']) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, status } : item
    ));
  };

  const updateItemNotes = (id: string, notes: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, notes } : item
    ));
  };

  const getStatusIcon = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getPriorityColor = (priority: ChecklistItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getProgress = () => {
    const completed = checklist.filter(item => item.status === 'completed').length;
    return Math.round((completed / checklist.length) * 100);
  };

  const exportToCSV = () => {
    const headers = ['Category', 'Item', 'Status', 'Priority', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...checklist.map(item => [
        `"${item.category}"`,
        `"${item.item}"`,
        item.status,
        item.priority,
        `"${item.notes || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'due-diligence-checklist.csv';
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Due Diligence Checklist</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage all due diligence requirements for your transaction
          </p>
        </div>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{getProgress()}% Complete</span>
              </div>
              <Progress value={getProgress()} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {checklist.filter(item => item.status === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {checklist.filter(item => item.status === 'in-progress').length}
                </div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {checklist.filter(item => item.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setStatusFilter('all');
                setPriorityFilter('all');
              }}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Checklist by Category */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.slice(0, 5).map(category => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {category.split(' ')[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {selectedCategory === 'all' ? (
            categories.map(category => {
              const categoryItems = filteredItems.filter(item => item.category === category);
              if (categoryItems.length === 0) return null;
              
              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {categoryItems.map(item => (
                        <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {getStatusIcon(item.status)}
                            <div className="min-w-0 flex-1">
                              <div className="font-medium">{item.item}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getPriorityColor(item.priority)}>
                                  {item.priority}
                                </Badge>
                                <select
                                  value={item.status}
                                  onChange={(e) => updateItemStatus(item.id, e.target.value as ChecklistItem['status'])}
                                  className="text-xs border rounded px-2 py-1"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="in-progress">In Progress</option>
                                  <option value="completed">Completed</option>
                                </select>
                              </div>
                              <Input
                                placeholder="Add notes..."
                                value={item.notes || ''}
                                onChange={(e) => updateItemNotes(item.id, e.target.value)}
                                className="mt-2 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{selectedCategory}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredItems.map(item => (
                    <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {getStatusIcon(item.status)}
                        <div className="min-w-0 flex-1">
                          <div className="font-medium">{item.item}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                            <select
                              value={item.status}
                              onChange={(e) => updateItemStatus(item.id, e.target.value as ChecklistItem['status'])}
                              className="text-xs border rounded px-2 py-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                          <Input
                            placeholder="Add notes..."
                            value={item.notes || ''}
                            onChange={(e) => updateItemNotes(item.id, e.target.value)}
                            className="mt-2 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
