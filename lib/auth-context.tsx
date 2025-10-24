'use client';

import React, {createContext, useContext, useEffect, useState} from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string | null;
    created_at: string;
    updated_at: string;
    avatar?: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<User>;
    logout: () => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<User>;
    isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider( {children} : {children: React.ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter()

    useEffect(() => {
        checkAuth();        
    }, []);

    async function checkAuth() {
        const token = Cookies.get('auth_token');
        console.log('checkAuth - token from cookie:', token);
        if (token) {
            try {
                const response = await api.get('/api/restify/profile');
                const user = {
                    id: parseInt(response.data.data.id),
                    name: response.data.data.attributes.name,
                    email: response.data.data.attributes.email,
                    email_verified_at: response.data.data.attributes.email_verified_at,
                    created_at: response.data.data.attributes.created_at,
                    updated_at: response.data.data.attributes.updated_at,
                    avatar: response.data.data.attributes.avatar,
                };
                setUser(user);
                console.log('checkAuth - user authenticated:', user);
            } catch(error) {
                console.log('checkAuth - profile fetch failed, removing token:', error);
                Cookies.remove('auth_token');
            }
        }
        setLoading(false);
    };

    async function login(credentials: LoginCredentials): Promise<User> {
        setError(null);
        setLoading(true);
        try {
            const response = await api.post('/api/login', credentials);
            console.log('Login response:', response.data);
            const token = response.data.meta?.token;
            const user = {
                id: parseInt(response.data.id),
                name: response.data.attributes.name,
                email: response.data.attributes.email,
                email_verified_at: response.data.attributes.email_verified_at,
                created_at: response.data.attributes.created_at,
                updated_at: response.data.attributes.updated_at,
                avatar: response.data.attributes.avatar,
            };

            console.log('Setting auth_token cookie with token:', token);
            Cookies.set('auth_token', token, { expires: 7, sameSite: 'lax' });
            console.log('Cookie set, verifying:', Cookies.get('auth_token'));
            setUser(user);
            router.push('/');
            return user;
        } catch(error: any) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    async function register(credentials: RegisterCredentials): Promise<User> {
        setError(null);
        setLoading(true);
        try {
            const response = await api.post('/api/register', credentials);
            console.log('Register response:', response.data);
            const token = response.data.meta?.token;
            const user = {
                id: parseInt(response.data.id),
                name: response.data.attributes.name,
                email: response.data.attributes.email,
                email_verified_at: response.data.attributes.email_verified_at,
                created_at: response.data.attributes.created_at,
                updated_at: response.data.attributes.updated_at,
                avatar: response.data.attributes.avatar,
            };

            console.log('Setting auth_token cookie with token:', token);
            Cookies.set('auth_token', token, { expires: 7, sameSite: 'lax' });
            console.log('Cookie set, verifying:', Cookies.get('auth_token'));
            setUser(user);
            router.push('/');
            return user;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        try {
            await api.post('/api/logout');
            
        } catch(error) {
            console.error('Logout failed', error);
        } finally {
            Cookies.remove('auth_token');
            setUser(null);
            router.push('/login');
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            login,
            logout,
            register,
            isAuthenticated: () => !!user,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('Not working');
    }
    return context;
}