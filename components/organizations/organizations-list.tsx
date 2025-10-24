'use client';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { DataTable, Column } from '@/components/ui/data-table';
import { useOrganizations } from '@/app/hooks/use-queries';
import { Organization } from '@/app/services/api-service';
import { useRouter } from 'next/navigation';

export function OrganizationsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const { data: organizations = [], isLoading: loading, error } = useOrganizations(debouncedSearch);
  const router = useRouter();

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
    router.push('/organizations/create');
  };

  const handleRowClick = (org: Organization) => {
    router.push(`/organizations/${org.id}`);
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
      loading={loading}
      error={error?.message || null}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    />
  );
}