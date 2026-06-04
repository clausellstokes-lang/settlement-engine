/**
 * components/auth/ResetPasswordPage.jsx - the dedicated /reset-password route.
 *
 * Wraps AuthPanel in 'reset' mode: collect an email, fire the reset link,
 * show the "check your email" confirmation. No post-auth redirect here - the
 * actual password change happens on the Supabase-hosted recovery link, not on
 * this request form. A "Back to Sign In" affordance lives inside AuthPanel;
 * the footer offers the same as a crawlable link.
 */
import { navigate } from '../../hooks/useRoute.js';
import { viewToPath } from '../../lib/routes.js';
import AuthPanel, { AUTH_MODE_VIEW } from './AuthPanel.jsx';
import { AuthPageShell, FooterLink } from './authUI.jsx';

export default function ResetPasswordPage() {
  const goMode = (mode) => navigate(AUTH_MODE_VIEW[mode] || 'signin');

  return (
    <AuthPageShell
      title="Reset your password"
      subtitle="We'll email you a secure link to set a new one."
      footer={
        <span>
          Remembered it?{' '}
          <FooterLink
            href={viewToPath('signin')}
            onClick={(e) => { e.preventDefault(); navigate('signin'); }}
          >
            Back to Sign In
          </FooterLink>
        </span>
      }
    >
      <AuthPanel
        initialMode="reset"
        showTabs={false}
        onModeChange={goMode}
      />
    </AuthPageShell>
  );
}
