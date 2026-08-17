import { Alert } from '@/components/ui/Alert';
import { getErrorMessage } from '@/lib/getErrorMessage';

interface ApiErrorAlertProps {
  error: unknown;
}

/** Renders any thrown API error using the backend's message field when available. */
export function ApiErrorAlert({ error }: ApiErrorAlertProps) {
  if (!error) return null;
  return <Alert variant="error">{getErrorMessage(error)}</Alert>;
}
