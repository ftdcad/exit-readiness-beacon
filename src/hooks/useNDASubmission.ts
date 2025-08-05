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
      // At the very top of submitNDA:
      console.log('=== DEBUGGING 401 ERROR ===');
      console.log('Supabase client available:', !!supabase);
      console.log('Supabase client type:', typeof supabase);

      // Get user's IP address (optional - don't let this block submission)
      let ip = null;
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ip = ipData.ip;
      } catch (ipError) {
        console.warn('Could not fetch IP address:', ipError);
        // Continue without IP - don't block submission
      }

      // Before the insert:
      const { data: session } = await supabase.auth.getSession();
      console.log('Session:', session);
      console.log('Auth header check - session exists:', !!session);

      console.log('Data being inserted:', JSON.stringify({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        company: formData.company,
        ip_address: ip,
        user_agent: navigator.userAgent,
        status: 'accepted'
      }, null, 2));

      const { data, error } = await supabase
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