'use client';

import { DetailView, Field } from '@/components/ui/detail-view';
import { useAuth, User } from '@/lib/auth-context';
import { useState, useRef } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Camera, User as UserIcon } from 'lucide-react';
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
  const [profilePhoto, setProfilePhoto] = useState<string | null>(user?.avatar || null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (data: Partial<User & { password?: string }>) => {
    setIsUpdating(true);
    try {
      const hasNameChange = data.name && data.name !== user?.name;
      const hasEmailChange = data.email && data.email !== user?.email;
      const hasPasswordChange = data.password && data.password.trim() !== '';
      const hasAvatarChange = photoFile !== null;
      
      if (hasNameChange || hasEmailChange || hasPasswordChange || hasAvatarChange) {
        if (hasAvatarChange) {
          const formData = new FormData();
          formData.append('avatar', photoFile!);
          formData.append('name', data.name || user?.name || '');
          formData.append('email', data.email || user?.email || '');
          
          console.log('Uploading avatar with FormData (POST)');
          console.log('FormData contents:', {
            avatar: photoFile?.name,
            name: data.name || user?.name,
            email: data.email || user?.email,
            hasPassword: hasPasswordChange
          });
          
          if (hasPasswordChange) {
            formData.append('password', data.password!);
          }
          
          const response = await api.post('/api/restify/profile', formData);
          console.log('Avatar upload response:', response.data);
        } else {
          const updatePayload: any = {
            name: data.name || user?.name,
            email: data.email || user?.email,
          };
          
          if (hasPasswordChange) {
            updatePayload.password = data.password;
          }
          
          const response = await api.put('/api/restify/profile', updatePayload);
        }
        
        window.location.reload();
      } else {
        setIsEditing(false);
      }
    } catch (err: any) {
      console.error('Update failed:', err);
      console.error('Error response data:', err.response?.data);
      console.error('Error response status:', err.response?.status);
      
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

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
              {profilePhoto ? (
                <img
                  src={profilePhoto.startsWith('data:') ? profilePhoto : `${process.env.NEXT_PUBLIC_API_URL || ''}${profilePhoto}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-12 h-12" />
              )}
            </div>
            {isEditing && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-lg hover:bg-primary/90 transition-colors"
                  title="Upload photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {user.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>

          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

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
          updateButtonText="Save Changes"
          loading={false}
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsEditing(false);
              setProfilePhoto(null);
              setPhotoFile(null);
            }}
            className="mt-4"
          >
            Cancel
          </Button>
        </DetailView>
      )}
    </div>
  );
}