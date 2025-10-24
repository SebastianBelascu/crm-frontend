'use client';

import { DetailView, Field } from '@/components/ui/detail-view';
import { useContact, useUpdateContact, useDeleteContact, useOrganizations } from '@/app/hooks/use-queries';
import { Contact } from '@/app/services/api-service';
import { contactSchema } from '@/lib/validations';
import { useMemo } from 'react';

interface ContactDetailProps {
  id: number;
}

export function ContactDetail({ id }: ContactDetailProps) {
  const { data: contact, isLoading, error } = useContact(id);
  const { data: organizations = [] } = useOrganizations();
  const updateMutation = useUpdateContact();
  const deleteMutation = useDeleteContact();

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

  const handleUpdate = async (data: Partial<Contact>) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id);
  };

  return (
    <DetailView<Contact>
      title={contact ? `${contact.first_name} ${contact.last_name}` : 'Contact'}
      backLink="/contacts"
      backLinkText="Contacts"
      data={contact || null}
      fields={contactFields}
      loading={isLoading}
      error={error?.message || null}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      updateButtonText="Update Contact"
      deleteButtonText="Delete Contact"
      validationSchema={contactSchema}
    />
  );
}