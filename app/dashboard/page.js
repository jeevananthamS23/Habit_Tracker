'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '../../components/Dashboard'; 


export default function DashboardPage() {
  const [userName, setUserName] = useState('Guest');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session'); 
        if (response.ok) {
          const data = await response.json();
          setUserName(data.user.name || 'User'); 
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/login'); 
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem' }}>Loading Dashboard...</div>;
  }

  return <Dashboard userName={userName} />;
}
