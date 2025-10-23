'use client';

import { useState } from "react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export function RegisterForm() {
  const { register, loading, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Validation
    if (!name || !email || !password || !passwordConfirmation) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long');
      return;
    }

    if (password !== passwordConfirmation) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await register({ 
        name, 
        email, 
        password, 
        password_confirmation: passwordConfirmation 
      });
    } catch (err: any) {
      setLocalError(err.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
      
      {(error || localError) && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded">
          {error || localError}
        </div>
      )}

      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <FieldDescription>
              Enter your full name.
            </FieldDescription>
            <Input 
              id="name" 
              type="text" 
              placeholder="John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <FieldDescription>
              Enter your email address.
            </FieldDescription>
            <Input 
              id="email" 
              type="email" 
              placeholder="demo@restify.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <FieldDescription>
              Must be at least 8 characters long.
            </FieldDescription>
            <Input 
              id="password" 
              type="password" 
              placeholder="********" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              minLength={8}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password_confirmation">Confirm Password</FieldLabel>
            <FieldDescription>
              Re-enter your password.
            </FieldDescription>
            <Input 
              id="password_confirmation" 
              type="password" 
              placeholder="********" 
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              disabled={loading}
              required
            />
          </Field>
        </FieldGroup> 
      </FieldSet>
      
      <Button className="w-full mt-6" type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Register'}
      </Button>

      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
          Sign in here
        </Link>
      </p>
    </form>
  )
}
