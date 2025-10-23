'use client';

import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/data-table';

interface Organization {
  id: number;
  name: string;
  city: string;
  phone: string;
}

const mockOrganizations: Organization[] = [
  { id: 1, name: 'Abernathy Inc', city: 'New Maxineshire', phone: '877-274-5845' },
  { id: 2, name: 'Altenwerth Inc', city: 'North Cristal', phone: '866-843-4101' },
  { id: 3, name: 'Barrows, Mertz and Batz', city: 'South Constanceburgh', phone: '(866) 773-6355' },
  { id: 4, name: 'Bayer-Satterfield', city: 'West Isabellaport', phone: '800-810-6324' },
  { id: 5, name: 'Bosco-Dicki', city: 'Cruickshankbury', phone: '(844) 280-6737' },
  { id: 6, name: 'Breitenberg Ltd', city: 'Bethborough', phone: '(800) 704-6836' },
  { id: 7, name: 'Casper Group', city: 'Willstad', phone: '855.715.9873' },
  { id: 8, name: 'Conn, DuBuque and Kerluke', city: 'Lake Alfonsomouthh', phone: '855.205.7175' },
];

export function OrganizationsList() {
  const [organizations] = useState<Organization[]>(mockOrganizations);

  const columns: Column<Organization>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (org) => (
        <div className="text-sm font-medium text-primary dark:text-primary">
          {org.name}
        </div>
      ),
    },
    {
      key: 'city',
      label: 'City',
      render: (org) => (
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {org.city}
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (org) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {org.phone}
        </div>
      ),
    },
  ];

  const handleCreateClick = () => {
    console.log('Create organization clicked');
  };

  const handleRowClick = (org: Organization) => {
    console.log('Organization clicked:', org);
  };

  return (
    <DataTable
      title="Organizations"
      data={organizations}
      columns={columns}
      searchPlaceholder="Search..."
      createButtonText="Create Organization"
      onCreateClick={handleCreateClick}
      onRowClick={handleRowClick}
      searchKeys={['name', 'city', 'phone']}
    />
  );
}