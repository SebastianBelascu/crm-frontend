'use client';

import { DetailView, Field } from '@/components/ui/detail-view';
import { useCreateOrganization } from '@/app/hooks/use-queries';
import { Organization } from '@/app/services/api-service';
import { useRouter } from 'next/navigation';

const organizationFields: Field[] = [
  { name: 'name', label: 'Name:', type: 'text', gridCols: 2 },
  { name: 'email', label: 'Email:', type: 'email' },
  { name: 'phone', label: 'Phone:', type: 'tel' },
  { name: 'address', label: 'Address:', type: 'text', gridCols: 2 },
  { name: 'city', label: 'City:', type: 'text' },
  { name: 'province', label: 'Province/State:', type: 'text' },
  { 
    name: 'country', 
    label: 'Country:', 
    type: 'select',
    options: [
      { value: '', label: 'Select a country' },
      { value: 'United States', label: 'United States' },
      { value: 'Canada', label: 'Canada' },
      { value: 'United Kingdom', label: 'United Kingdom' },
      { value: 'Germany', label: 'Germany' },
      { value: 'France', label: 'France' },
      { value: 'Spain', label: 'Spain' },
      { value: 'Italy', label: 'Italy' },
      { value: 'Australia', label: 'Australia' },
    ]
  },
  { name: 'postal_code', label: 'Postal code:', type: 'text' },
];

export function OrganizationCreate() {
  const createMutation = useCreateOrganization();
  const router = useRouter();

  const handleCreate = async (data: Partial<Organization>) => {
    await createMutation.mutateAsync(data);
    router.push('/organizations');
  };

  return (
    <DetailView<Organization>
      title="Create Organization"
      backLink="/organizations"
      backLinkText="Organizations"
      fields={organizationFields}
      onSubmit={handleCreate}
      submitButtonText="Create Organization"
      isCreateMode={true}
    />
  );
}