'use client';

import { DetailView, Field } from '@/components/ui/detail-view';
import { useOrganization, useUpdateOrganization, useDeleteOrganization } from '@/app/hooks/use-queries';
import { Organization } from '@/app/services/api-service';
import { RelatedContactsTable } from '@/components/ui/related-tables';

interface OrganizationDetailProps {
  id: number;
}

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

export function OrganizationDetail({ id }: OrganizationDetailProps) {
  const { data: organization, isLoading, error } = useOrganization(id);
  const updateMutation = useUpdateOrganization();
  const deleteMutation = useDeleteOrganization();

  const handleUpdate = async (data: Partial<Organization>) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id);
  };

  return (
    <DetailView<Organization>
      title={organization?.name || 'Organization'}
      backLink="/organizations"
      backLinkText="Organizations"
      data={organization || null}
      fields={organizationFields}
      loading={isLoading}
      error={error?.message || null}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      updateButtonText="Update Organization"
      deleteButtonText="Delete Organization"
    >
      <RelatedContactsTable organizationId={id} />
    </DetailView>
  );
}