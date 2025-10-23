'use client';

import React, {createContext, useContext, useEffect, useState} from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string | null;
    created_at: string;
    updated_at: string;
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
        const token = localStorage.getItem('auth_token');
        if (token) {
            try {
                const response = await api.get('/api/restify/profile');
                setUser(response.data);
            } catch(error) {
                localStorage.removeItem('auth_token');
            }
        }
        setLoading(false);
    };

    async function login(credentials: LoginCredentials): Promise<User> {
        setError(null);
        setLoading(true);
        try {
            const response = await api.post('/api/login', credentials);
            const {token, user} = response.data;

            localStorage.setItem('auth_token', token);
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
            const { token, user} = response.data;

            localStorage.setItem('auth_token', token);
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
            localStorage.removeItem('auth_token');
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