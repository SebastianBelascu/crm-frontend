'use client';

import { useState, useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import { DataTable, Column } from '@/components/ui/data-table';
import { useContacts, useOrganizations } from '@/app/hooks/use-queries';
import { Contact } from '@/app/services/api-service';
import { useRouter } from 'next/navigation';

export function ContactsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  
  const { data: response, isLoading: loading, error } = useContacts(debouncedSearch, cityFilter, sortBy, currentPage, perPage);
  const contacts = response?.data || [];
  const meta = response?.meta;
  
  const { data: allResponse } = useContacts(undefined, undefined, undefined, 1, 10000);
  const allContacts = allResponse?.data || [];
  
  const { data: orgResponse } = useOrganizations(undefined, undefined, undefined, 1, 10000);
  const organizations = orgResponse?.data || [];
  
  const router = useRouter();

  const orgMap = useMemo(() => {
    const map = new Map();
    organizations.forEach(org => map.set(org.id, org.name));
    return map;
  }, [organizations]);

  const cityOptions = useMemo(() => {
    const cities = allContacts
      .map((contact: Contact) => contact.city)
      .filter((city): city is string => !!city)
      .filter((city: string, index: number, self: string[]) => self.indexOf(city) === index)
      .sort();
    return cities.map((city: string) => ({ label: city, value: city }));
  }, [allContacts]);

  const sortOptions = [
    { label: 'Name (A-Z)', value: 'first_name' },
    { label: 'Name (Z-A)', value: '-first_name' },
  ];

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
          {contact.organization_id ? orgMap.get(contact.organization_id) || 'Unknown' : '-'}
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