'use client';

import { ReactNode, useEffect } from 'react';
import { useForm, Resolver, DefaultValues, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export interface Field<T> {
  name: Path<T>;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'select';
  options?: { value: string | number; label: string }[];
  placeholder?: string;
  gridCols?: 1 | 2;
  valueAsNumber?: boolean;
}

interface DetailViewProps<T> {
  title: string;
  backLink: string;
  backLinkText: string;
  data?: T | null;
  fields: Field<T>[];
  loading?: boolean;
  error?: string | null;
  onSubmit?: (data: T) => Promise<void>;
  onUpdate?: (data: T) => Promise<void>;
  onDelete?: () => Promise<void>;
  submitButtonText?: string;
  updateButtonText?: string;
  deleteButtonText?: string;
  isCreateMode?: boolean;
  children?: ReactNode;
  validationSchema?: z.ZodType<T>;
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
  validationSchema,
}: DetailViewProps<T>) {
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<T>({
    resolver: validationSchema ? (zodResolver(validationSchema) as Resolver<T>) : undefined,
    defaultValues: (data || {}) as DefaultValues<T>,
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const onFormSubmit = async (formData: T) => {
    const handler = isCreateMode ? onSubmit : onUpdate;
    if (!handler) return;
    try {
      await handler(formData);
    } catch (err) {
      console.error('Submit failed:', err);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await onDelete();
    } catch (err) {
      console.error('Delete failed:', err);
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

      <form onSubmit={handleFormSubmit(onFormSubmit)}>
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
                  <>
                    <select
                      id={field.name}
                      {...register(field.name, {
                        valueAsNumber: field.valueAsNumber,
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors[field.name] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors[field.name]?.message as string}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <Input
                      id={field.name}
                      type={field.type || 'text'}
                      {...register(field.name)}
                      placeholder={field.placeholder}
                      className={errors[field.name] ? 'border-red-500' : ''}
                    />
                    {errors[field.name] && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors[field.name]?.message as string}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            {onDelete && !isCreateMode && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                {deleteButtonText}
              </Button>
            )}
            {(onSubmit || onUpdate) && (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="ml-auto"
              >
                {isSubmitting ? (
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
      </form>

      {children}
    </div>
  );
}