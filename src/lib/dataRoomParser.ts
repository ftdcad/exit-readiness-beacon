// Data Room document parser for extracting financial data from uploaded P&L statements
import { supabase } from '@/integrations/supabase/client';

export interface ExtractedFinancialData {
  revenue?: number;
  cogs?: number;
  opex?: number;
  netIncome?: number;
  currentEbitda?: number;
  source: 'data_room' | 'assessment' | 'manual';
  documentName?: string;
}

// Check for uploaded P&L documents in data room
export const getDataRoomFinancials = async (userId: string): Promise<ExtractedFinancialData | null> => {
  try {
    const { data: documents, error } = await supabase
      .from('data_room_documents')
      .select('*')
      .eq('user_id', userId)
      .eq('category', 'Financials')
      .ilike('document_name', '%p%l%')
      .eq('is_active', true)
      .order('upload_date', { ascending: false })
      .limit(1);

    if (error || !documents || documents.length === 0) {
      return null;
    }

    const document = documents[0];
    
    // For now, return sample data that would be extracted from the document
    // In a real implementation, this would parse the actual file
    const extractedData = await parseFinancialDocument(document);
    
    return {
      ...extractedData,
      source: 'data_room',
      documentName: document.document_name
    };
  } catch (error) {
    console.error('Error fetching data room financials:', error);
    return null;
  }
};

// Mock document parser - in production, this would parse actual files
const parseFinancialDocument = async (document: any): Promise<Partial<ExtractedFinancialData>> => {
  // This is a simplified mock parser
  // Real implementation would:
  // 1. Download the file from storage
  // 2. Parse PDF/Excel content using libraries like pdf-parse or xlsx
  // 3. Use pattern matching to find revenue, COGS, operating expenses
  // 4. Calculate EBITDA from the extracted values
  
  // For demo purposes, return sample data based on document metadata
  if (document.document_name.toLowerCase().includes('acme')) {
    return {
      revenue: 2500000,
      cogs: 1100000,
      opex: 950000,
      netIncome: 450000,
      currentEbitda: 450000, // Revenue - COGS - OpEx
    };
  }
  
  // Default mock values for other documents
  return {
    revenue: 1000000,
    cogs: 400000,
    opex: 350000,
    netIncome: 250000,
    currentEbitda: 250000,
  };
};

// Get the best available financial data with priority order
export const getBestFinancialData = async (
  userId: string,
  assessment: any
): Promise<ExtractedFinancialData> => {
  // Priority 1: Data Room documents
  const dataRoomData = await getDataRoomFinancials(userId);
  if (dataRoomData) {
    return dataRoomData;
  }

  // Priority 2: Financial Assessment
  if (assessment) {
    return {
      revenue: assessment.revenue || 0,
      netIncome: assessment.net_income || 0,
      currentEbitda: assessment.current_ebitda || 0,
      source: 'assessment'
    };
  }

  // Priority 3: Default/manual entry
  return {
    revenue: 0,
    netIncome: 0,
    currentEbitda: 0,
    source: 'manual'
  };
};

// Check if user has uploaded P&L documents
export const hasDataRoomFinancials = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('data_room_documents')
      .select('id')
      .eq('user_id', userId)
      .eq('category', 'Financials')
      .eq('is_active', true)
      .limit(1);

    return !error && data && data.length > 0;
  } catch (error) {
    return false;
  }
};