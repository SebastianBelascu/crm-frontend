import { z } from 'zod';

export const organizationSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  
  email: z.string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  
  phone: z.string()
    .min(1, 'Phone is required')
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Invalid phone number'),
  
  address: z.string()
    .min(1, 'Address is required')
    .max(200, 'Address must be less than 200 characters'),
  
  city: z.string()
    .min(1, 'City is required')
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be less than 100 characters'),
  
  province: z.string()
    .min(1, 'Province/State is required')
    .max(100, 'Province/State must be less than 100 characters'),
  
  country: z.string()
    .min(1, 'Country is required')
    .max(100, 'Country must be less than 100 characters'),
  
  postal_code: z.string()
    .min(1, 'Postal code is required')
    .max(20, 'Postal code must be less than 20 characters'),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;

export const contactSchema = z.object({
  first_name: z.string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  
  last_name: z.string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  
  organization_id: z.coerce.number({
    message: 'Please select an organization',
  }).positive('Please select a valid organization').refine(val => val > 0, {
    message: 'Organization is required',
  }),
  
  email: z.string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  
  phone: z.string()
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Invalid phone number')
    .min(1, 'Phone is required'),
  
  address: z.string()
    .min(1, 'Address is required')
    .max(200, 'Address must be less than 200 characters'),
  
  city: z.string()
    .min(1, 'City is required')
    .max(100, 'City must be less than 100 characters'),
  
  province: z.string()
    .min(1, 'Province/State is required')
    .max(100, 'Province/State must be less than 100 characters'),
  
  country: z.string()
    .min(1, 'Country is required')
    .max(100, 'Country must be less than 100 characters'),
  
  postal_code: z.string()
    .min(1, 'Postal code is required')
    .max(20, 'Postal code must be less than 20 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>