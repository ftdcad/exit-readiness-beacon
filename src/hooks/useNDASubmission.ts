import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NDAFormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
}

export const useNDASubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitNDA = async (formData: NDAFormData) => {
    setIsSubmitting(true);
    
    try {
      // Get user's IP address (for security logging)
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();

      // Submit NDA record to Supabase
      const { data, error } = await (supabase as any)
        .from('nda_records')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          company: formData.company,
          ip_address: ip,
          user_agent: navigator.userAgent,
          status: 'accepted'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Store acceptance in localStorage for immediate access
      localStorage.setItem('meridian_nda_accepted', JSON.stringify({
        id: data?.id,
        acceptedAt: data?.created_at,
        email: formData.email
      }));

      toast({
        title: "NDA Accepted",
        description: "Thank you! You can now proceed with the assessment.",
      });

      return { success: true, data };
    } catch (error: any) {
      console.error('NDA submission error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error processing your NDA. Please try again.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkNDAStatus = () => {
    const stored = localStorage.getItem('meridian_nda_accepted');
    return stored ? JSON.parse(stored) : null;
  };

  return {
    submitNDA,
    checkNDAStatus,
    isSubmitting
  };
};