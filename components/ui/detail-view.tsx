'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export interface Field {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'select';
  options?: { value: string; label: string }[];
  placeholder?: string;
  gridCols?: 1 | 2;
}

interface DetailViewProps<T> {
  title: string;
  backLink: string;
  backLinkText: string;
  data?: T | null;
  fields: Field[];
  loading?: boolean;
  error?: string | null;
  onSubmit?: (data: Partial<T>) => Promise<void>;
  onUpdate?: (data: Partial<T>) => Promise<void>;
  onDelete?: () => Promise<void>;
  submitButtonText?: string;
  updateButtonText?: string;
  deleteButtonText?: string;
  isCreateMode?: boolean;
  children?: ReactNode;
}

export function DetailView<T extends Record<string, any>>({
  title,
  backLink,
  backLinkText,
  data = null,
  fields,
  loading = false,
  error = null,
  onSubmit,
  onUpdate,
  onDelete,
  submitButtonText = 'Create',
  updateButtonText = 'Update',
  deleteButtonText = 'Delete',
  isCreateMode = false,
  children,
}: DetailViewProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>(data || {});
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (name: string, value: string) => {
    const finalValue = name.endsWith('_id') && value ? parseInt(value) : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async () => {
    const handler = isCreateMode ? onSubmit : onUpdate;
    if (!handler) return;
    setIsUpdating(true);
    try {
      await handler(formData);
    } catch (err) {
      console.error('Submit failed:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm('Are you sure you want to delete this item?')) return;
    setIsDeleting(true);
    try {
      await onDelete();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 font-medium mb-2">Error loading data</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{error}</p>
      </div>
    );
  }

  if (!data && !isCreateMode) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No data found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Link href={backLink} className="hover:text-primary">
          {backLinkText}
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">{title}</span>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div
              key={field.name}
              className={field.gridCols === 1 ? 'md:col-span-2' : 'md:col-span-1'}
            >
              <Label htmlFor={field.name} className="mb-2 block">
                {field.label}
              </Label>
              {field.type === 'select' && field.options ? (
                <select
                  id={field.name}
                  value={formData[field.name]?.toString() || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.name}
                  type={field.type || 'text'}
                  value={(formData[field.name] as string) || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          {onDelete && !isCreateMode && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || isUpdating}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                deleteButtonText
              )}
            </Button>
          )}
          {(onSubmit || onUpdate) && (
            <Button
              onClick={handleSubmit}
              disabled={isUpdating || isDeleting}
              className="ml-auto"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isCreateMode ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                isCreateMode ? submitButtonText : updateButtonText
              )}
            </Button>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}