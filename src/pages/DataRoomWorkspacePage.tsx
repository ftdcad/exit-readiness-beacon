import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Folder, FolderOpen, CheckCircle, X, FileText } from 'lucide-react';
import { AddFolderDialog } from '@/components/AddFolderDialog';

interface UploadedFile {
  file: File;
  destinationFolders: string[];
}

interface Subfolder {
  id: string;
  name: string;
  count: number;
}

interface FolderStructure {
  id: string;
  name: string;
  count: number;
  subfolders: Subfolder[];
}

export const DataRoomWorkspacePage: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  
  // Folder structure with subfolders
  const [folderStructure, setFolderStructure] = useState<FolderStructure[]>([
    {
      id: 'corporate',
      name: 'Corporate Documents',
      count: 0,
      subfolders: [
        { id: 'corp-formation', name: 'Formation Documents', count: 0 },
        { id: 'corp-governance', name: 'Governance', count: 0 },
        { id: 'corp-ownership', name: 'Ownership', count: 0 }
      ]
    },
    {
      id: 'financial',
      name: 'Financials',
      count: 0,
      subfolders: [
        { id: 'fin-statements', name: 'Financial Statements', count: 0 },
        { id: 'fin-tax', name: 'Tax Returns', count: 0 },
        { id: 'fin-ar-ap', name: 'AR/AP Aging', count: 0 }
      ]
    },
    {
      id: 'legal',
      name: 'Legal',
      count: 0,
      subfolders: [
        { id: 'legal-contracts', name: 'Material Contracts', count: 0 },
        { id: 'legal-ip', name: 'Intellectual Property', count: 0 },
        { id: 'legal-litigation', name: 'Litigation', count: 0 }
      ]
    },
    {
      id: 'operations',
      name: 'Operations',
      count: 0,
      subfolders: [
        { id: 'ops-procedures', name: 'SOPs', count: 0 },
        { id: 'ops-vendors', name: 'Vendor Agreements', count: 0 },
        { id: 'ops-insurance', name: 'Insurance Policies', count: 0 }
      ]
    },
    {
      id: 'hr',
      name: 'Human Resources',
      count: 0,
      subfolders: [
        { id: 'hr-handbook', name: 'Employee Handbook', count: 0 },
        { id: 'hr-benefits', name: 'Benefits', count: 0 },
        { id: 'hr-agreements', name: 'Employment Agreements', count: 0 }
      ]
    },
    {
      id: 'warranties',
      name: 'Warranties & Representations',
      count: 0,
      subfolders: [
        { id: 'war-corporate', name: 'Corporate Matters', count: 0 },
        { id: 'war-financial', name: 'Financial Matters', count: 0 },
        { id: 'war-compliance', name: 'Compliance', count: 0 }
      ]
    }
  ]);
  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setCurrentFile(e.dataTransfer.files[0]);
      setSelectedFolders([]);
    }
  }, []);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCurrentFile(e.target.files[0]);
      setSelectedFolders([]);
    }
  };
  
  const toggleFolder = (folderId: string) => {
    setSelectedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleAddFolder = (parentId: string | null, folderName: string) => {
    if (parentId === null) {
      // Adding a new parent folder
      const newParentId = `parent-${Date.now()}`;
      setFolderStructure(prev => [...prev, {
        id: newParentId,
        name: folderName,
        count: 0,
        subfolders: []
      }]);
    } else {
      // Adding a subfolder to existing parent
      setFolderStructure(prev => 
        prev.map(folder => {
          if (folder.id === parentId) {
            const newSubfolderId = `${parentId}-${Date.now()}`;
            return {
              ...folder,
              subfolders: [
                ...folder.subfolders,
                { id: newSubfolderId, name: folderName, count: 0 }
              ]
            };
          }
          return folder;
        })
      );
    }
  };
  
  const handleUpload = () => {
    if (currentFile && selectedFolders.length > 0) {
      setUploadedFiles(prev => [...prev, {
        file: currentFile,
        destinationFolders: selectedFolders
      }]);
      setCurrentFile(null);
      setSelectedFolders([]);
    }
  };
  
  const getTotalDocumentCount = () => uploadedFiles.length;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Data Room Workspace</h1>
          <p className="text-muted-foreground">Upload once, distribute to multiple folders</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Documents: </span>
            <span className="font-semibold text-foreground">{getTotalDocumentCount()}</span>
          </div>
          <AddFolderDialog onAddFolder={handleAddFolder} folderStructure={folderStructure} />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Folder Structure */}
        <div>
          <Card className="p-4">
            <h3 className="font-semibold text-foreground mb-4">Folders</h3>
            <div className="space-y-1">
              {folderStructure.map(folder => (
                <div key={folder.id}>
                  <div 
                    className="flex items-center justify-between p-2 hover:bg-accent rounded cursor-pointer"
                    onClick={() => setExpandedFolders(prev => 
                      prev.includes(folder.id) 
                        ? prev.filter(id => id !== folder.id)
                        : [...prev, folder.id]
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {expandedFolders.includes(folder.id) ? 
                        <FolderOpen className="w-4 h-4" /> : 
                        <Folder className="w-4 h-4" />
                      }
                      <span className="text-sm">{folder.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{folder.count}</span>
                  </div>
                  {expandedFolders.includes(folder.id) && (
                    <div className="ml-6 space-y-1">
                      {folder.subfolders.map(sub => (
                        <div key={sub.id} className="flex items-center justify-between p-1 text-sm text-muted-foreground">
                          <span>{sub.name}</span>
                          <span className="text-xs">{sub.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Center & Right: Upload Area */}
        <div className="col-span-2">
          {!currentFile ? (
            /* Drop Zone */
            <Card 
              className={`border-2 border-dashed p-12 text-center transition-colors ${
                dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileSelect}
                multiple
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-semibold text-foreground mb-2">
                  Drop files here or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Upload once, then select all folders where this document belongs
                </p>
              </label>
            </Card>
          ) : (
            /* Folder Selection */
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">{currentFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(currentFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setCurrentFile(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Where should this document be stored?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select ALL folders where this document is needed (you can select multiple)
                  </p>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                  {folderStructure.map(folder => (
                    <div key={folder.id} className="space-y-2">
                      <div className="font-semibold text-sm text-foreground">
                        {folder.name}
                      </div>
                      {folder.subfolders.map(sub => (
                        <label 
                          key={sub.id}
                          className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer ml-4"
                        >
                          <Checkbox 
                            checked={selectedFolders.includes(sub.id)}
                            onCheckedChange={() => toggleFolder(sub.id)}
                          />
                          <span className="text-sm">{sub.name}</span>
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
                
                {selectedFolders.length > 0 && (
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm text-primary">
                      Document will be uploaded to {selectedFolders.length} folder{selectedFolders.length > 1 ? 's' : ''}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handleUpload}
                    disabled={selectedFolders.length === 0}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Upload to {selectedFolders.length || 'Selected'} Folders
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentFile(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}
          
          {/* Recent Uploads */}
          {uploadedFiles.length > 0 && (
            <Card className="p-4 mt-6">
              <h3 className="font-semibold text-foreground mb-3">Recent Uploads</h3>
              <div className="space-y-2">
                {uploadedFiles.slice(-5).reverse().map((upload, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground truncate flex-1">
                      {upload.file.name}
                    </span>
                    <span className="text-primary">
                      → {upload.destinationFolders.length} folders
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
      
      {/* Progress Bar */}
      <Card className="p-4 bg-primary/10 border-primary/30">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-foreground">
              Data Room Progress: {Math.round((getTotalDocumentCount() / 3500) * 100)}%
            </p>
            <p className="text-sm text-muted-foreground">
              {getTotalDocumentCount()} of ~3,500 documents uploaded
            </p>
          </div>
          <Button variant="outline" size="sm">
            View Checklist
          </Button>
        </div>
      </Card>
    </div>
  );
};
