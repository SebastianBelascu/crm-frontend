'use client';

import { useState, useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import { DataTable, Column } from '@/components/ui/data-table';
import { useOrganizations } from '@/app/hooks/use-queries';
import { Organization } from '@/app/services/api-service';
import { useRouter } from 'next/navigation';

export function OrganizationsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  
  // Fetch filtered organizations
  const { data: response, isLoading: loading, error } = useOrganizations(debouncedSearch, cityFilter, sortBy, currentPage, perPage);
  const organizations = response?.data || [];
  const meta = response?.meta;
  
  // Fetch all organizations for filter options (without filters, with high perPage to get all)
  const { data: allResponse } = useOrganizations(undefined, undefined, undefined, 1, 10000);
  const allOrganizations = allResponse?.data || [];
  
  const router = useRouter();

  // Get unique cities from ALL organizations for filter options
  const cityOptions = useMemo(() => {
    const cities = allOrganizations
      .map((org: Organization) => org.city)
      .filter((city: string, index: number, self: string[]) => city && self.indexOf(city) === index)
      .sort();
    return cities.map((city: string) => ({ label: city, value: city }));
  }, [allOrganizations]);

  const sortOptions = [
    { label: 'Name (A-Z)', value: 'name' },
    { label: 'Name (Z-A)', value: '-name' },
  ];

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
      filterOptions={cityOptions}
      selectedFilter={cityFilter}
      onFilterChange={setCityFilter}
      filterLabel="Filter by City"
      sortBy={sortBy}
      onSortChange={setSortBy}
      sortOptions={sortOptions}
      currentPage={meta?.current_page || 1}
      totalPages={meta?.last_page || 1}
      perPage={perPage}
      onPageChange={setCurrentPage}
      onPerPageChange={(newPerPage) => {
        setPerPage(newPerPage);
        setCurrentPage(1);
      }}
    />
  );
}