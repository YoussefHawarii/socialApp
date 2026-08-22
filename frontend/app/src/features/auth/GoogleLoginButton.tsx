import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '@/features/auth/useAuth';
import { ApiErrorAlert } from '@/components/shared/ApiErrorAlert';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from '@/store/toast.store';

export function GoogleLoginButton() {
  const navigate = useNavigate();
  const googleLogin = useGoogleLogin();

  const onSuccess = (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) return;
    googleLogin.mutate(
      { idToken: credentialResponse.credential },
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
      {googleLogin.isError && <ApiErrorAlert error={googleLogin.error} />}
      {googleLogin.isPending ? (
        <div className="flex h-10 items-center justify-center">
          <Spinner size="sm" />
        </div>
      ) : (
        <GoogleLogin onSuccess={onSuccess} onError={() => {}} text="continue_with" />
      )}
    </div>
  );
}
