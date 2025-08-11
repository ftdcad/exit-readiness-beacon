
import { supabase } from '@/integrations/supabase/client';

type SavePayload = {
  step_1_8?: any;
  step_9?: any;
  step_10?: any;
  email?: string | null;
};

export async function saveAssessmentProgress(payload: SavePayload) {
  console.log('[assessment] saveAssessmentProgress called with:', payload);

  // If email is present, try to upsert by email (update first match)
  if (payload.email) {
    const { data: existing, error: lookupError } = await supabase
      .from('assessment_submissions')
      .select('id')
      .eq('email', payload.email)
      .limit(1)
      .maybeSingle();

    if (lookupError) {
      console.warn('[assessment] lookup by email failed, will insert new row:', lookupError);
    }

    if (existing?.id) {
      console.log('[assessment] updating existing submission:', existing.id);
      const { error: updError } = await supabase
        .from('assessment_submissions')
        .update({
          step_1_8: payload.step_1_8 ?? undefined,
          step_9: payload.step_9 ?? undefined,
          step_10: payload.step_10 ?? undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (updError) throw updError;
      return existing.id as string;
    }
  }

  // Insert new record
  const { data, error } = await supabase
    .from('assessment_submissions')
    .insert({
      email: payload.email ?? null,
      step_1_8: payload.step_1_8 ?? {},
      step_9: payload.step_9 ?? {},
      step_10: payload.step_10 ?? {},
    })
    .select('id')
    .single();

  if (error) throw error;
  console.log('[assessment] created new submission:', data?.id);
  return data!.id as string;
}

export async function submitConsultation(args: {
  submission: { step_1_8?: any; step_9?: any; step_10?: any; email?: string | null };
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}) {
  console.log('[assessment] submitConsultation with:', {
    hasStep9: !!args.submission.step_9,
    hasStep10: !!args.submission.step_10,
    email: args.email,
  });

  // Ensure submission exists/updated with email and steps
  const submissionId = await saveAssessmentProgress({
    step_1_8: args.submission.step_1_8 ?? {},
    step_9: args.submission.step_9 ?? {},
    step_10: args.submission.step_10 ?? {},
    email: args.email || args.submission.email || null,
  });

  // Insert consultation request
  const { error } = await supabase.from('consultation_requests').insert({
    submission_id: submissionId,
    name: args.name,
    email: args.email,
    phone: args.phone ?? null,
    notes: args.notes ?? null,
  });

  if (error) throw error;
  console.log('[assessment] consultation request created for submission:', submissionId);
  return { submissionId };
}
