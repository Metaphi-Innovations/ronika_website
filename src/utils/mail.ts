/**
 * Generates a Gmail compose URL routed through Google AccountChooser.
 *
 * If the user is logged into multiple Google accounts in their browser,
 * Google presents the "Choose an account" screen so they can pick which
 * account to send from. After selecting, Gmail opens directly in that account
 * with the standard bottom-right compose dialog prefilled with the recipient.
 */
export function getGmailComposeUrl(emailOrUrl?: string): string {
  if (!emailOrUrl) return '';
  const cleanEmail = emailOrUrl.replace(/^mailto:/i, '').trim();
  const gmailDestination = `https://mail.google.com/mail/?extsrc=mailto&url=mailto%3A${encodeURIComponent(cleanEmail)}`;
  return `https://accounts.google.com/AccountChooser?service=mail&continue=${encodeURIComponent(gmailDestination)}`;
}
