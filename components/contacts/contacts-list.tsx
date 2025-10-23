'use client';

import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/data-table';

interface Contact {
  id: number;
  name: string;
  organization: string;
  city: string;
  phone: string;
}

const mockContacts: Contact[] = [
  { id: 1, name: 'John Doe', organization: 'Abernathy Inc', city: 'New York', phone: '555-0123' },
  { id: 2, name: 'Jane Smith', organization: 'Altenwerth Inc', city: 'Los Angeles', phone: '555-0124' },
  { id: 3, name: 'Bob Johnson', organization: 'Casper Group', city: 'Chicago', phone: '555-0125' },
];

export function ContactsList() {
  const [contacts] = useState<Contact[]>(mockContacts);

  const columns: Column<Contact>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (contact) => (
        <div className="text-sm font-medium text-primary dark:text-primary">
          {contact.name}
        </div>
      ),
    },
    {
      key: 'organization',
      label: 'Organization',
      render: (contact) => (
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {contact.organization}
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
    console.log('Create contact clicked');
  };

  const handleRowClick = (contact: Contact) => {
    console.log('Contact clicked:', contact);
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
      searchKeys={['name', 'organization', 'city', 'phone']}
    />
  );
}