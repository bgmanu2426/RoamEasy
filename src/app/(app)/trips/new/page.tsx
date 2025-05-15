
import { TripForm } from '@/components/trip-form';
import { PageHeader } from '@/components/page-header';

export default function NewTripPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Plan Your Next Adventure"
        description="Fill in the details below to create a new trip."
      />
      <TripForm />
    </div>
  );
}
