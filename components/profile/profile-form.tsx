'use client';

import { DetailView, Field } from '@/components/ui/detail-view';
import { useAuth, User } from '@/lib/auth-context';
import { useState } from 'react';
import api from '@/lib/axios';

const profileFields: Field[] = [
  { name: 'name', label: 'Name:', type: 'text', gridCols: 2 },
  { name: 'email', label: 'Email:', type: 'email', gridCols: 2 },
  { name: 'password', label: 'Password:', type: 'text', placeholder: 'Leave blank to keep current password', gridCols: 2 },
];

export function ProfileForm() {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (data: Partial<User & { password?: string }>) => {
    setIsUpdating(true);
    try {
      const updateData = { ...data };
      if (!updateData.password) {
        delete updateData.password;
      }
      
      await api.patch('/api/restify/profile', updateData);

      window.location.reload();
    } catch (err: any) {
      console.error('Update failed:', err);
      throw new Error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DetailView<User & { password?: string }>
      title={user?.name || 'User Profile'}
      backLink="/"
      backLinkText="Dashboard"
      data={user}
      fields={profileFields}
      onUpdate={handleUpdate}
      updateButtonText="Update Profile"
      loading={!user}
    />
  );
}