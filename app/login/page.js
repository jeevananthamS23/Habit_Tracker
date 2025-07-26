'use client'; 
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import AuthForm from '../../components/AuthForm'; 

export default function LoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  
  const handleLogin = async (formData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/dashboard');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      type="login"
      title="Welcome Back!"
      subtitle="Log in to continue tracking your habits."
      buttonText="Log In"
      onSubmit={handleLogin}
      errorMessage={error}
      isLoading={isLoading}
    />
  );
}
