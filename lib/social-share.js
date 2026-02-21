// LinkedIn Share Helper
// Pre-populates LinkedIn share dialog

export function getLinkedInShareUrl(credential) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://excellere.vercel.app';
  const shareUrl = `${baseUrl}/c/${credential.credential_slug || credential.share_slug}`;
  
  const postText = `I've just completed the ${credential.module_name || 'AI Leadership'} programme with @Excellere. 
  
What surprised me most wasn't the content — it was the assessment. Aria identified me as a "${credential.archetype || 'Strategic Thinker'}" — which, honestly, is more accurate than anything I'd have written about myself.

The credential is validated by ${credential.validator_name || 'Excellere faculty'} and linked below.

#AIStrategy #ExecEd #AILeadership #ContinuousLearning`;

  const params = new URLSearchParams({
    url: shareUrl,
    summary: postText
  });
  
  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
}

export function openLinkedInShare(credential) {
  const url = getLinkedInShareUrl(credential);
  window.open(url, '_blank', 'width=600,height=500');
}

export default { getLinkedInShareUrl, openLinkedInShare };
