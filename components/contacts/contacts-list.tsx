'use client';

import { DataTable, Column } from '@/components/ui/data-table';
import { useContacts } from '@/app/hooks/use-queries';
import { Contact } from '@/app/services/api-service';
import { useRouter } from 'next/navigation';

export function ContactsList() {
  const { data: contacts = [], isLoading: loading, error } = useContacts();
  const router = useRouter();

  const columns: Column<Contact>[] = [
    {
      key: 'first_name',
      label: 'Name',
      render: (contact) => (
        <div className="text-sm font-medium text-primary dark:text-primary">
          {contact.first_name} {contact.last_name}
        </div>
      ),
    },
    {
      key: 'organization_id',
      label: 'Organization',
      render: (contact) => (
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {contact.organization_id}
        </div>
      ),
    },
    {
      key: 'city',
      label: 'City',
      render: (contact) => (
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {contact.city}
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (contact) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {contact.phone}
        </div>
      ),
    },
  ];

  const handleCreateClick = () => {
    router.push('/contacts/create');
  };

  const handleRowClick = (contact: Contact) => {
    router.push(`/contacts/${contact.id}`);
  };

  return (
    <DataTable
      title="Contacts"
      data={contacts}
      columns={columns}
      searchPlaceholder="Search..."
      createButtonText="Create Contact"
      onCreateClick={handleCreateClick}
      onRowClick={handleRowClick}
      searchKeys={['first_name', 'last_name', 'city', 'phone']}
      loading={loading}
      error={error?.message || null}
    />
  );
}