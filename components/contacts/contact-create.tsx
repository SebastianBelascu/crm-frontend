'use client';

import { DetailView, Field } from '@/components/ui/detail-view';
import { useCreateContact, useOrganizations } from '@/app/hooks/use-queries';
import { Contact } from '@/app/services/api-service';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

export function ContactCreate() {
  const createMutation = useCreateContact();
  const { data: organizations = [] } = useOrganizations();
  const router = useRouter();

  const contactFields: Field[] = useMemo(() => [
    { name: 'first_name', label: 'First Name:', type: 'text' },
    { name: 'last_name', label: 'Last Name:', type: 'text' },
    { name: 'email', label: 'Email:', type: 'email' },
    { name: 'phone', label: 'Phone:', type: 'tel' },
    { 
      name: 'organization_id', 
      label: 'Organization:', 
      type: 'select',
      gridCols: 2,
      options: [
        { value: '', label: 'Select an organization' },
        ...organizations.map(org => ({
          value: org.id.toString(),
          label: org.name
        }))
      ]
    },
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
  ], [organizations]);

  const handleCreate = async (data: Partial<Contact>) => {
    await createMutation.mutateAsync(data);
    router.push('/contacts');
  };

  return (
    <DetailView<Contact>
      title="Create Contact"
      backLink="/contacts"
      backLinkText="Contacts"
      fields={contactFields}
      onSubmit={handleCreate}
      submitButtonText="Create Contact"
      isCreateMode={true}
    />
  );
}