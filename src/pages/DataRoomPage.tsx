import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Folder, File, Check, X, AlertCircle, Download, Eye, ChevronRight, ChevronDown, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

interface DataRoomDocument {
  id: string;
  category: string;
  subcategory: string;
  documentType: string;
  documentName: string;
  fileUrl: string;
  fileSize: number;
  uploadDate: string;
  version: number;
  isActive: boolean;
}

interface FolderStructure {
  category: string;
  subcategory: string;
  documentTypes: string[];
  isRequired: boolean;
  uploadedDocs: DataRoomDocument[];
  completionPercentage: number;
  isCustom?: boolean;
}

interface CustomFolderModal {
  isOpen: boolean;
  mode: 'category' | 'subcategory';
  parentCategory?: string;
}

interface ReadinessScore {
  overallScore: string;
  totalDocuments: number;
  requiredDocuments: number;
  missingCritical: string[];
}

const categoryIcons: Record<string, string> = {
  'Corporate Documents': '🏢',
  'Financials': '💰',
  'Legal': '⚖️',
  'Operations': '⚙️',
  'Marketing & Sales': '📈',
  'Human Resources': '👥'
};

const documentPatterns: Record<string, RegExp> = {
  'Tax Return': /tax.*return|form.*1120|1065|1040/i,
  'Income Statement': /p&l|profit.*loss|income.*statement/i,
  'Balance Sheet': /balance.*sheet|assets.*liabilities/i,
  'Cap Table': /cap.*table|capitalization/i,
  'Operating Agreement': /operating.*agreement|llc.*agreement/i,
  'Bylaws': /bylaw|by-law/i,
  'Customer List': /customer.*list|client.*list/i,
  'Org Chart': /org.*chart|organization.*chart/i
};

export default function DataRoomPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [folderStructure, setFolderStructure] = useState<FolderStructure[]>([]);
  const [readinessScore, setReadinessScore] = useState<ReadinessScore>({
    overallScore: 'F',
    totalDocuments: 0,
    requiredDocuments: 0,
    missingCritical: []
  });
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [customFolderModal, setCustomFolderModal] = useState<CustomFolderModal>({
    isOpen: false,
    mode: 'category'
  });
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderIcon, setNewFolderIcon] = useState('📁');
  const [newFolderRequired, setNewFolderRequired] = useState(false);

  useEffect(() => {
    loadDataRoom();
  }, [user]);

  const loadDataRoom = async () => {
    if (!user) return;

    try {
      // Load folder structure
      const { data: structure } = await supabase
        .from('data_room_structure')
        .select('*')
        .order('sort_order');

      // Load user's documents
      const { data: documents } = await supabase
        .from('data_room_documents')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      // Load readiness score
      const { data: readiness } = await supabase
        .from('data_room_readiness')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (structure) {
        const folderData: FolderStructure[] = structure.map(folder => {
          const uploadedDocs = documents?.filter(doc => 
            doc.category === folder.category && 
            doc.subcategory === folder.subcategory
          ).map(doc => ({
            id: doc.id,
            category: doc.category,
            subcategory: doc.subcategory,
            documentType: doc.document_type || '',
            documentName: doc.document_name,
            fileUrl: doc.file_url,
            fileSize: doc.file_size || 0,
            uploadDate: doc.upload_date || '',
            version: doc.version,
            isActive: doc.is_active
          })) || [];

          const completionPercentage = folder.document_types.length > 0
            ? Math.round((uploadedDocs.length / folder.document_types.length) * 100)
            : 0;

          return {
            category: folder.category,
            subcategory: folder.subcategory,
            documentTypes: folder.document_types || [],
            isRequired: folder.is_required || false,
            uploadedDocs,
            completionPercentage,
            isCustom: folder.is_custom || false
          };
        });

        setFolderStructure(folderData);
      }

      if (readiness) {
        setReadinessScore({
          overallScore: readiness.overall_score,
          totalDocuments: readiness.total_documents,
          requiredDocuments: readiness.required_documents,
          missingCritical: readiness.missing_critical || []
        });
      }

      calculateReadiness();
    } catch (error) {
      console.error('Error loading data room:', error);
      toast.error('Failed to load data room');
    } finally {
      setLoading(false);
    }
  };

  const calculateReadiness = async () => {
    if (!user) return;

    const totalRequired = folderStructure.filter(f => f.isRequired).reduce((sum, f) => sum + f.documentTypes.length, 0);
    const totalUploaded = folderStructure.reduce((sum, f) => sum + f.uploadedDocs.length, 0);
    
    const criticalMissing: string[] = [];
    folderStructure.forEach(folder => {
      if (folder.isRequired) {
        folder.documentTypes.forEach(docType => {
          if (!folder.uploadedDocs.some(doc => doc.documentType === docType)) {
            criticalMissing.push(`${folder.category} - ${docType}`);
          }
        });
      }
    });

    const percentage = totalRequired > 0 ? (totalUploaded / totalRequired) * 100 : 0;
    let score = 'F';
    if (percentage >= 90) score = 'A';
    else if (percentage >= 80) score = 'B';
    else if (percentage >= 70) score = 'C';
    else if (percentage >= 60) score = 'D';

    await supabase
      .from('data_room_readiness')
      .upsert({
        user_id: user.id,
        overall_score: score,
        total_documents: totalUploaded,
        required_documents: totalRequired,
        missing_critical: criticalMissing,
        last_calculated: new Date().toISOString()
      });

    setReadinessScore({
      overallScore: score,
      totalDocuments: totalUploaded,
      requiredDocuments: totalRequired,
      missingCritical: criticalMissing
    });
  };

  const detectDocumentType = (fileName: string): string => {
    for (const [docType, pattern] of Object.entries(documentPatterns)) {
      if (pattern.test(fileName)) {
        return docType;
      }
    }
    return 'Other Document';
  };

  const handleFileUpload = async (files: FileList) => {
    if (!user || !selectedCategory || !selectedSubcategory) {
      toast.error('Please select a folder first');
      return;
    }

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}_${file.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(fileName);

        // Detect document type
        const documentType = detectDocumentType(file.name);

        // Check for existing version
        const { data: existingDocs } = await supabase
          .from('data_room_documents')
          .select('id, version')
          .eq('user_id', user.id)
          .eq('category', selectedCategory)
          .eq('subcategory', selectedSubcategory)
          .eq('document_type', documentType)
          .order('version', { ascending: false })
          .limit(1);

        const previousVersion = existingDocs?.[0];
        const newVersion = previousVersion ? previousVersion.version + 1 : 1;

        // Deactivate previous version
        if (previousVersion) {
          await supabase
            .from('data_room_documents')
            .update({ is_active: false })
            .eq('id', previousVersion.id);
        }

        // Insert new document
        const { error: insertError } = await supabase
          .from('data_room_documents')
          .insert({
            user_id: user.id,
            category: selectedCategory,
            subcategory: selectedSubcategory,
            document_type: documentType,
            document_name: file.name,
            file_url: publicUrl,
            file_size: file.size,
            version: newVersion,
            previous_version_id: previousVersion?.id,
            is_active: true
          });

        if (insertError) throw insertError;

        toast.success(`Uploaded ${file.name} (v${newVersion})`);
      }

      await loadDataRoom();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'A': return 'text-green-500';
      case 'B': return 'text-blue-500';
      case 'C': return 'text-yellow-500';
      case 'D': return 'text-orange-500';
      case 'F': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const createCustomFolder = async () => {
    if (!user || !newFolderName.trim()) return;

    try {
      if (customFolderModal.mode === 'category') {
        // Create new major category
        const { error } = await supabase
          .from('data_room_structure')
          .insert({
            category: newFolderName,
            subcategory: 'General',
            document_types: [],
            is_required: newFolderRequired,
            is_custom: true,
            created_by: user.id,
            sort_order: 100 + folderStructure.length
          });

        if (error) throw error;
        
        // Update category icons
        categoryIcons[newFolderName] = newFolderIcon;
        
      } else {
        // Create new subcategory
        const { error } = await supabase
          .from('data_room_structure')
          .insert({
            category: customFolderModal.parentCategory,
            subcategory: newFolderName,
            document_types: [],
            is_required: newFolderRequired,
            is_custom: true,
            created_by: user.id,
            sort_order: 100 + folderStructure.filter(f => f.category === customFolderModal.parentCategory).length
          });

        if (error) throw error;
      }

      toast.success(`Created ${newFolderName}`);
      setCustomFolderModal({ isOpen: false, mode: 'category' });
      setNewFolderName('');
      setNewFolderIcon('📁');
      setNewFolderRequired(false);
      await loadDataRoom();
    } catch (error) {
      console.error('Create folder error:', error);
      toast.error('Failed to create folder');
    }
  };

  const exportDataRoomIndex = () => {
    const index = folderStructure.map(folder => 
      `## ${folder.category} - ${folder.subcategory}
${folder.uploadedDocs.map(doc => `- ${doc.documentName} (v${doc.version})`).join('\n')}
`).join('\n');

    const blob = new Blob([`# Data Room Index\nGenerated: ${new Date().toLocaleDateString()}\n\n${index}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DataRoom-Index-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="text-foreground/70">Loading data room...</div></div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Data Room</h1>
          <p className="text-foreground/70">Build your PE-ready data room while learning exit readiness</p>
        </div>

        {/* Readiness Score */}
        <div className="bg-card border rounded-xl p-6 mb-8 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">PE Readiness Score</h2>
              <p className="text-foreground/60">
                {readinessScore.totalDocuments} of {readinessScore.requiredDocuments} required documents uploaded
              </p>
            </div>
            <div className={`text-6xl font-bold ${getScoreColor(readinessScore.overallScore)}`}>
              {readinessScore.overallScore}
            </div>
          </div>
          
          {readinessScore.missingCritical.length > 0 && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-destructive font-medium mb-2">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Critical documents missing:
              </p>
              <ul className="text-sm text-destructive/80 space-y-1">
                {readinessScore.missingCritical.slice(0, 5).map((doc, i) => (
                  <li key={i}>• {doc}</li>
                ))}
                {readinessScore.missingCritical.length > 5 && (
                  <li>• ...and {readinessScore.missingCritical.length - 5} more</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Folder Structure */}
          <div className="bg-card border rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-foreground mb-4">Document Folders</h2>
            
            <div className="space-y-2">
              {/* Add New Section Button */}
              <button
                onClick={() => setCustomFolderModal({ isOpen: true, mode: 'category' })}
                className="w-full px-4 py-3 bg-accent/20 hover:bg-accent/30 border border-accent/30 rounded-lg transition flex items-center justify-center gap-2 text-accent"
              >
                <Plus className="w-5 h-5" />
                Add New Section
              </button>

              {Object.entries(
                folderStructure.reduce((acc, folder) => {
                  if (!acc[folder.category]) acc[folder.category] = [];
                  acc[folder.category].push(folder);
                  return acc;
                }, {} as Record<string, FolderStructure[]>)
              ).map(([category, folders]) => (
                <div key={category} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full px-4 py-3 bg-muted/50 hover:bg-muted transition flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{categoryIcons[category]}</span>
                      <span className="text-foreground font-medium">{category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-foreground/60">
                        {folders.reduce((sum, f) => sum + f.uploadedDocs.length, 0)} docs
                      </div>
                      {expandedCategories.has(category) ? 
                        <ChevronDown className="w-5 h-5 text-foreground/60" /> : 
                        <ChevronRight className="w-5 h-5 text-foreground/60" />
                      }
                    </div>
                  </button>
                  
                  {expandedCategories.has(category) && (
                    <div className="bg-muted/20">
                      {folders.map(folder => (
                        <button
                          key={`${folder.category}-${folder.subcategory}`}
                          onClick={() => {
                            setSelectedCategory(folder.category);
                            setSelectedSubcategory(folder.subcategory);
                          }}
                          className={`w-full px-6 py-3 hover:bg-muted/30 transition flex items-center justify-between text-left ${
                            selectedCategory === folder.category && selectedSubcategory === folder.subcategory
                              ? 'bg-primary/20 border-l-2 border-primary'
                              : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Folder className="w-4 h-4 text-foreground/40" />
                            <div>
                              <p className="text-foreground text-sm">{folder.subcategory}</p>
                              <p className="text-foreground/40 text-xs">
                                {folder.uploadedDocs.length}/{folder.documentTypes.length} documents
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {folder.isRequired && (
                              <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded">Required</span>
                            )}
                            {folder.isCustom && (
                              <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">Custom</span>
                            )}
                            <div className="text-xs text-foreground/60">
                              {folder.completionPercentage}%
                            </div>
                          </div>
                        </button>
                      ))}
                      
                      {/* Add Subfolder Button */}
                      <button
                        onClick={() => setCustomFolderModal({ 
                          isOpen: true, 
                          mode: 'subcategory', 
                          parentCategory: category 
                        })}
                        className="w-full px-6 py-3 hover:bg-accent/10 transition flex items-center gap-3 text-accent text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Subfolder
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div className="bg-card border rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-foreground mb-4">Upload Documents</h2>
            
            {selectedCategory && selectedSubcategory ? (
              <>
                <div className="mb-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <p className="text-primary">
                    Uploading to: <span className="font-medium">{selectedCategory} → {selectedSubcategory}</span>
                  </p>
                </div>

                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                    dragActive ? 'border-primary bg-primary/10' : 'border-border'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-foreground/40 mx-auto mb-4" />
                  <p className="text-foreground mb-2">Drag files here or click to upload</p>
                  <p className="text-foreground/60 text-sm">PDF, DOC, DOCX, XLS, XLSX files</p>
                  
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="file-upload"
                    className="mt-4 inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg cursor-pointer hover:bg-primary/90 transition"
                  >
                    {uploading ? 'Uploading...' : 'Select Files'}
                  </label>
                </div>

                {/* Expected Documents */}
                <div className="mt-6">
                  <h3 className="text-foreground font-medium mb-3">Expected Documents:</h3>
                  <div className="space-y-2">
                    {folderStructure
                      .find(f => f.category === selectedCategory && f.subcategory === selectedSubcategory)
                      ?.documentTypes.map(docType => {
                        const uploaded = folderStructure
                          .find(f => f.category === selectedCategory && f.subcategory === selectedSubcategory)
                          ?.uploadedDocs.some(doc => doc.documentType === docType);
                        
                        return (
                          <div key={docType} className="flex items-center gap-2 text-sm">
                            {uploaded ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <X className="w-4 h-4 text-destructive" />
                            )}
                            <span className={uploaded ? 'text-foreground/60' : 'text-foreground'}>
                              {docType}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Folder className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                <p className="text-foreground/60">Select a folder to start uploading documents</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={exportDataRoomIndex}
            className="bg-secondary text-secondary-foreground py-3 px-6 rounded-lg hover:bg-secondary/80 transition flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export Index
          </button>
          
          <button
            className="bg-secondary text-secondary-foreground py-3 px-6 rounded-lg hover:bg-secondary/80 transition flex items-center gap-2"
          >
            <Eye className="w-5 h-5" />
            PE Buyer Preview
          </button>
          
          <button
            onClick={() => navigate('/portal/week-1/ebitda-mastery')}
            className="ml-auto bg-primary text-primary-foreground py-3 px-6 rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
          >
            Continue to EBITDA Calculator
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Custom Folder Modal */}
        {customFolderModal.isOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card border rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Add New {customFolderModal.mode === 'category' ? 'Section' : 'Folder'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-foreground/70 mb-2">Name</label>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2 text-foreground"
                    placeholder={customFolderModal.mode === 'category' ? 'e.g., Clinical Documentation' : 'e.g., Vendor Contracts'}
                    autoFocus
                  />
                </div>
                
                {customFolderModal.mode === 'category' && (
                  <div>
                    <label className="block text-sm text-foreground/70 mb-2">Icon</label>
                    <div className="grid grid-cols-8 gap-2">
                      {['📁', '🏥', '🏭', '💊', '🔬', '📊', '🏢', '⚕️', '🧬', '🔧', '🌿', '📱'].map(icon => (
                        <button
                          key={icon}
                          onClick={() => setNewFolderIcon(icon)}
                          className={`text-2xl p-2 rounded border ${
                            newFolderIcon === icon 
                              ? 'border-primary bg-primary/20' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={newFolderRequired}
                    onChange={(e) => setNewFolderRequired(e.target.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-foreground">Mark as required for PE readiness</span>
                </label>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setCustomFolderModal({ isOpen: false, mode: 'category' })}
                  className="flex-1 bg-muted text-foreground py-2 px-4 rounded-lg hover:bg-muted/80 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={createCustomFolder}
                  disabled={!newFolderName.trim()}
                  className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                >
                  Create {customFolderModal.mode === 'category' ? 'Section' : 'Folder'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}