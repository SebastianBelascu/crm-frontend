import api from '@/lib/axios';

class ApiService {
  async getAll<T>(endpoint: string): Promise<T[]> {
    const response = await api.get(endpoint);
    if (Array.isArray(response.data.data)) {
      return response.data.data.map((item: any) => ({
        id: parseInt(item.id),
        ...item.attributes
      }));
    }
    return response.data;
  }

  async getById<T>(endpoint: string, id: number | string): Promise<T> {
    const response = await api.get(`${endpoint}/${id}`);
    if (response.data.data && response.data.data.attributes) {
      return {
        id: parseInt(response.data.data.id),
        ...response.data.data.attributes
      } as T;
    }
    return response.data;
  }

  async create<T>(endpoint: string, data: Partial<T>): Promise<T> {
    const response = await api.post(endpoint, data);
    if (response.data.data && response.data.data.attributes) {
      return {
        id: parseInt(response.data.data.id),
        ...response.data.data.attributes
      } as T;
    }
    return response.data;
  }

  async update<T>(endpoint: string, id: number | string, data: Partial<T>): Promise<T> {
    const response = await api.put(`${endpoint}/${id}`, data);
    if (response.data.data && response.data.data.attributes) {
      return {
        id: parseInt(response.data.data.id),
        ...response.data.data.attributes
      } as T;
    }
    return response.data;
  }

  async delete(endpoint: string, id: number | string): Promise<void> {
    await api.delete(`${endpoint}/${id}`);
  }
}

export interface Organization {
  id: number;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city: string;
  province?: string;
  country?: string;
  postal_code?: string;
}

class OrganizationsService extends ApiService {
  private endpoint = '/api/restify/organizations';

  getOrganizations() {
    return this.getAll<Organization>(this.endpoint);
  }

  getOrganization(id: number) {
    return this.getById<Organization>(this.endpoint, id);
  }

  createOrganization(data: Partial<Organization>) {
    return this.create<Organization>(this.endpoint, data);
  }

  updateOrganization(id: number, data: Partial<Organization>) {
    return this.update<Organization>(this.endpoint, id, data);
  }

  deleteOrganization(id: number) {
    return this.delete(this.endpoint, id);
  }
}

export interface Contact {
  id: number;
  organization_id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
  postal_code?: string;
}

class ContactsService extends ApiService {
  private endpoint = '/api/restify/contacts';

  getContacts() {
    return this.getAll<Contact>(this.endpoint);
  }

  getContact(id: number) {
    return this.getById<Contact>(this.endpoint, id);
  }

  createContact(data: Partial<Contact>) {
    return this.create<Contact>(this.endpoint, data);
  }

  updateContact(id: number, data: Partial<Contact>) {
    return this.update<Contact>(this.endpoint, id, data);
  }

  deleteContact(id: number) {
    return this.delete(this.endpoint, id);
  }
}

export const organizationsService = new OrganizationsService();
export const contactsService = new ContactsService();