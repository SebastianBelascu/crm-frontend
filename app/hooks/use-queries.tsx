'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationsService, contactsService, Organization, Contact } from '@/app/services/api-service';
import { useRouter } from 'next/navigation';

export function useOrganizations() {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationsService.getOrganizations(),
  });
}

export function useOrganization(id: number) {
  return useQuery({
    queryKey: ['organizations', id],
    queryFn: () => organizationsService.getOrganization(id),
    enabled: !!id,
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Organization> }) =>
      organizationsService.updateOrganization(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organizations', variables.id] });
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: (id: number) => organizationsService.deleteOrganization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      router.push('/organizations');
    },
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Organization>) => organizationsService.createOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
}

export function useContacts() {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: () => contactsService.getContacts(),
  });
}

export function useContact(id: number) {
  return useQuery({
    queryKey: ['contacts', id],
    queryFn: () => contactsService.getContact(id),
    enabled: !!id,
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Contact> }) =>
      contactsService.updateContact(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contacts', variables.id] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: (id: number) => contactsService.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      router.push('/contacts');
    },
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Contact>) => contactsService.createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}