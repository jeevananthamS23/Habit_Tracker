'use client';
import { useRouter } from 'next/navigation';
import styles from './styles/Header.module.css'; 

export default function Header({ userName }) {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoSquare}></span>
        <span>Streakify</span>
      </div>
      <div className={styles.userInfo}>
        <span className={styles.userIcon}>👤</span>
        <span className={styles.userName}>{userName}</span>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </header>
  );
}
