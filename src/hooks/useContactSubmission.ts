import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ContactFormData {
  // Company Basics
  companyName: string;
  industry: string;
  founded: string;
  employees: string;
  
  // Financial
  revenue2025: string;
  revenue2024: string;
  revenue2023: string;
  revenue2022: string;
  
  // Investment & Structure
  investmentType: string;
  entityType: string;
  ownershipType: string;
  owners: Array<{ name: string; percentage: string }>;
  
  // Document Availability
  pnlAvailability: string;
  taxReturnsAvailability: string;
  balanceSheetsAvailability: string;
  
  // Goals & Challenges
  exitTimeline: string;
  exitType: string;
  currentChallenges: string;
  
  // Contact Info
  email: string;
  preferredContact: string;
  
  // Add-backs for EBITDA normalization
  addBacks?: {
    personalVehicles: { selected: boolean; notes: string };
    familySalaries: { selected: boolean; notes: string };
    ownerInsurance: { selected: boolean; notes: string };
    travelEntertainment: { selected: boolean; notes: string };
    personalProperty: { selected: boolean; notes: string };
    professionalServices: { selected: boolean; notes: string };
    discretionarySpending: { selected: boolean; notes: string };
    other: { selected: boolean; notes: string };
  };

  // Enhanced fields
  jobTitle?: string;
  companySize?: string;
  howDidYouHear?: string;
}

export const useContactSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitContact = async (formData: ContactFormData, ndaRecordId?: string) => {
    setIsSubmitting(true);
    
    try {
      console.log('Starting contact submission with data:', { 
        email: formData.email, 
        companyName: formData.companyName,
        ndaRecordId 
      });
      
      // Get user's IP address
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();
      console.log('Got IP address:', ip);

      const insertData = {
        nda_record_id: ndaRecordId,
        contact_email: formData.email,
        company_name: formData.companyName,
        industry: formData.industry,
        founded_year: formData.founded ? parseInt(formData.founded) : null,
        employee_count: formData.employees,
        revenue_2025: formData.revenue2025,
        revenue_2024: formData.revenue2024,
        revenue_2023: formData.revenue2023,
        revenue_2022: formData.revenue2022,
        investment_type: formData.investmentType,
        entity_type: formData.entityType,
        ownership_type: formData.ownershipType,
        ownership_structure: formData.owners,
        pnl_availability: formData.pnlAvailability,
        tax_returns_availability: formData.taxReturnsAvailability,
        balance_sheets_availability: formData.balanceSheetsAvailability,
        exit_timeline: formData.exitTimeline,
        exit_type: formData.exitType,
        current_challenges: formData.currentChallenges,
        preferred_contact: formData.preferredContact,
        job_title: formData.jobTitle,
        company_size: formData.companySize,
        how_did_you_hear: formData.howDidYouHear,
        add_backs: formData.addBacks,
        ip_address: ip,
        status: 'new'
      };
      
      console.log('Attempting to insert data:', insertData);

      // Submit contact inquiry to Supabase (anonymous insert allowed by RLS)
      const { data, error } = await supabase
        .from('contact_inquiries')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Assessment access logging removed to prevent submission errors

      // Store submission for local access
      localStorage.setItem('meridian_assessment_submitted', JSON.stringify({
        id: data?.id,
        submittedAt: data?.created_at,
        companyName: formData.companyName
      }));

      toast({
        title: "Assessment Submitted",
        description: "Thank you! We'll review your information and contact you within 24 hours.",
      });

      return { success: true, data };
    } catch (error: any) {
      console.error('Contact submission error:', error);
      toast({
        title: "Submission Failed", 
        description: "There was an error submitting your assessment. Please try again.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitContact,
    isSubmitting
  };
};