import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { mockCompanyData, mockDocuments } from '@/lib/mockDocuments';
import { toast } from 'sonner';

export const useSampleData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sampleDataLoaded, setSampleDataLoaded] = useState(false);

  const loadSampleData = async (userId: string) => {
    setIsLoading(true);
    
    try {
      // Check if sample data already exists
      const { data: existingDocs } = await supabase
        .from('data_room_documents')
        .select('id')
        .eq('user_id', userId)
        .eq('document_name', '2023_PnL_Statement.pdf')
        .limit(1);

      if (existingDocs && existingDocs.length > 0) {
        toast.info('Sample data already loaded');
        setSampleDataLoaded(true);
        return;
      }

      // Generate and upload each mock document
      for (const mockDoc of mockDocuments) {
        try {
          // Generate the document blob
          const documentBlob = mockDoc.generator(mockCompanyData);
          
          // Create file name with timestamp to avoid conflicts
          const fileName = `${userId}/sample_${Date.now()}_${mockDoc.name}`;
          
          // Upload to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileName, documentBlob);

          if (uploadError) {
            console.error(`Upload error for ${mockDoc.name}:`, uploadError);
            continue;
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(fileName);

          // Insert document record
          const { error: insertError } = await supabase
            .from('data_room_documents')
            .insert({
              user_id: userId,
              category: mockDoc.category,
              subcategory: mockDoc.subcategory,
              document_type: mockDoc.documentType,
              document_name: mockDoc.name,
              file_url: publicUrl,
              file_size: documentBlob.size,
              version: 1,
              is_active: true,
              metadata: {
                isSampleData: true,
                companyName: mockCompanyData.name,
                generated: new Date().toISOString()
              }
            });

          if (insertError) {
            console.error(`Insert error for ${mockDoc.name}:`, insertError);
            continue;
          }

          console.log(`Successfully uploaded ${mockDoc.name}`);
        } catch (error) {
          console.error(`Error processing ${mockDoc.name}:`, error);
        }
      }

      // Update data room progress for the uploaded categories
      const categories = [...new Set(mockDocuments.map(doc => doc.category))];
      
      for (const category of categories) {
        const categoryDocs = mockDocuments.filter(doc => doc.category === category);
        
        await supabase
          .from('data_room_progress')
          .upsert({
            user_id: userId,
            category: category,
            subcategory: 'General', // Default subcategory
            total_uploaded: categoryDocs.length,
            total_required: categoryDocs.length,
            completion_percentage: 100,
            is_completed: true,
            last_upload_date: new Date().toISOString()
          });
      }

      // Update readiness score
      await supabase
        .from('data_room_readiness')
        .upsert({
          user_id: userId,
          overall_score: 'A',
          total_documents: mockDocuments.length,
          required_documents: mockDocuments.length,
          missing_critical: [],
          last_calculated: new Date().toISOString()
        });

      setSampleDataLoaded(true);
      toast.success(`Sample data loaded successfully! ${mockDocuments.length} documents uploaded.`);
      
      // Return success indicator
      return true;
      
    } catch (error) {
      console.error('Error loading sample data:', error);
      toast.error('Failed to load sample data. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearSampleData = async (userId: string) => {
    setIsLoading(true);
    
    try {
      // Get all sample documents
      const { data: sampleDocs } = await supabase
        .from('data_room_documents')
        .select('id, file_url')
        .eq('user_id', userId)
        .contains('metadata', { isSampleData: true });

      if (sampleDocs && sampleDocs.length > 0) {
        // Delete from storage
        for (const doc of sampleDocs) {
          const urlParts = doc.file_url.split('/');
          const fileName = urlParts.slice(-2).join('/'); // Get userId/filename
          
          await supabase.storage
            .from('documents')
            .remove([fileName]);
        }

        // Delete from database
        await supabase
          .from('data_room_documents')
          .delete()
          .eq('user_id', userId)
          .contains('metadata', { isSampleData: true });

        // Reset progress
        await supabase
          .from('data_room_progress')
          .delete()
          .eq('user_id', userId);

        // Reset readiness score
        await supabase
          .from('data_room_readiness')
          .delete()
          .eq('user_id', userId);
      }

      setSampleDataLoaded(false);
      toast.success('Sample data cleared successfully');
      return true;
      
    } catch (error) {
      console.error('Error clearing sample data:', error);
      toast.error('Failed to clear sample data');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkSampleDataExists = useCallback(async (userId: string) => {
    try {
      const { data: sampleDocs } = await supabase
        .from('data_room_documents')
        .select('id')
        .eq('user_id', userId)
        .contains('metadata', { isSampleData: true })
        .limit(1);

      const exists = sampleDocs && sampleDocs.length > 0;
      setSampleDataLoaded(exists);
      return exists;
    } catch (error) {
      console.error('Error checking sample data:', error);
      return false;
    }
  }, []);

  return {
    isLoading,
    sampleDataLoaded,
    loadSampleData,
    clearSampleData,
    checkSampleDataExists
  };
};