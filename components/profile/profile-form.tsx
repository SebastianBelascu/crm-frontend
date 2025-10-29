'use client';

import { DetailView, Field } from '@/components/ui/detail-view';
import { useAuth, User } from '@/lib/auth-context';
import { useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { User as UserIcon } from 'lucide-react';
import Link from 'next/link';

const profileFields: Field[] = [
  { name: 'name', label: 'Name:', type: 'text', gridCols: 2 },
  { name: 'email', label: 'Email:', type: 'email', gridCols: 2 },
  { name: 'password', label: 'Password:', type: 'text', placeholder: 'Leave blank to keep current password', gridCols: 2 },
];

export function ProfileForm() {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async (data: Partial<User & { password?: string }>) => {
    setIsUpdating(true);
    try {
      const hasNameChange = data.name && data.name !== user?.name;
      const hasEmailChange = data.email && data.email !== user?.email;
      const hasPasswordChange = data.password && data.password.trim() !== '';
      
      if (hasNameChange || hasEmailChange || hasPasswordChange) {
        const updatePayload: any = {
          name: data.name || user?.name,
          email: data.email || user?.email,
        };
        
        if (hasPasswordChange) {
          updatePayload.password = data.password;
        }
        
        await api.put('/api/restify/profile', updatePayload);
        window.location.reload();
      } else {
        setIsEditing(false);
      }
    } catch (err: any) {
      console.error('Update failed:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors || 
                          'Failed to update profile';
      throw new Error(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Link href="/" className="hover:text-primary">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">
          {user.name || 'User Profile'}
        </span>
      </div>

      {!isEditing && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {user.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
            >
              Edit Profile
            </Button>
          </div>
        </div>
      )}

      {isEditing && (
        <DetailView<User & { password?: string }>
          title="Edit Profile"
          backLink="#"
          backLinkText=""
          data={user}
          fields={profileFields}
          onUpdate={async (data) => {
            await handleUpdate(data);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
          updateButtonText="Save Changes"
          loading={false}
        />
      )}
    </div>
  );
}