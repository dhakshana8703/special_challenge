import { NextResponse } from 'next/server';
import { authenticateRequest, PERSONAS } from '@/lib/iam';
import { getStore } from '@/lib/store';

export async function GET(req) {
  const auth = authenticateRequest(req);
  const store = getStore();
  const { user } = auth;

  const isPrivileged = user.persona === PERSONAS.LEARNING_MODERATOR || 
                       user.persona === PERSONAS.PORTAL_ADMIN || 
                       user.roles?.includes('product_owner');

  const themes = (store.themes || []).map(theme => {
    // Check distinct contributing organisations count
    // Hackathon threshold: at least 3 distinct client organisations!
    const distinctOrgs = theme.distinctContributingOrgs || 0;
    const isCompliant = distinctOrgs >= 3;

    if (!isCompliant && !isPrivileged) {
      // Small cohort suppression active for public and client members!
      return {
        id: theme.id,
        title: theme.title,
        offering: theme.offering,
        category: theme.category,
        summary: theme.summary,
        observationPeriod: theme.observationPeriod,
        distinctContributingOrgs: "< 3 (Suppressed)",
        confidence: "Preliminary / Low Sample",
        limitations: theme.limitations,
        privacySafeguardStatus: "suppressed",
        suppressionWarning: "Small Cohort Protection Active: Distinct contributing organisations < 3. Detailed evidence links and breakdown suppressed to prevent contributor re-identification.",
        linkedObservationIds: [], // Suppressed for privacy!
        latestUpdate: theme.latestUpdate,
        linkedIdeaId: theme.linkedIdeaId
      };
    }

    return {
      ...theme,
      privacySafeguardStatus: isCompliant ? 'compliant' : 'suppressed'
    };
  });

  return NextResponse.json({
    themes,
    minimumThresholdRequired: 3,
    privacySafeguardPolicy: "K-Anonymity (k >= 3 distinct contributing institutions) strictly enforced to prevent differencing attacks and re-identification."
  });
}
