import { Spinner } from '@/components/ui/Spinner';

export function PageSpinner() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner size="lg" className="text-brand-600" />
    </div>
  );
}
