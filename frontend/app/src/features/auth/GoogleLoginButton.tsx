import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@/features/auth/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { toast } from '@/store/toast.store';

/**
 * Scaffold for Google login: accepts a Google `idToken` and exchanges it via
 * POST /auth/google_login. A full Google Identity Services button (reading
 * VITE_GOOGLE_CLIENT_ID) can replace the manual input once credentials are issued.
 */
export function GoogleLoginButton() {
  const navigate = useNavigate();
  const googleLogin = useGoogleLogin();
  const [idToken, setIdToken] = useState('');

  const onSubmit = () => {
    if (!idToken.trim()) return;
    googleLogin.mutate(
      { idToken },
      {
        onSuccess: () => {
          toast.success('Logged in with Google');
          navigate('/', { replace: true });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-2 border-t border-gray-200 pt-4">
      <p className="text-xs text-gray-500">Sign in with Google (paste ID token)</p>
      {googleLogin.isError && <ApiErrorAlert error={googleLogin.error} />}
      <div className="flex gap-2">
        <Input
          placeholder="Google ID token"
          value={idToken}
          onChange={(e) => setIdToken(e.target.value)}
        />
        <Button variant="secondary" onClick={onSubmit} isLoading={googleLogin.isPending}>
          Continue
        </Button>
      </div>
    </div>
  );
}
