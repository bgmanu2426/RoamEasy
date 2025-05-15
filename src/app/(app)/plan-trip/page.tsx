
import { SuggestionsForm } from '@/components/suggestions-form';
import { PageHeader } from '@/components/page-header';

export default function PlanTripPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Get Trip Inspirations"
        description="Let our AI assistant help you discover your next dream destination."
      />
      <SuggestionsForm />
    </div>
  );
}
