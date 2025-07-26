'use client'; 
import Link from 'next/link';
import styles from './page.module.css';

export default function LandingPage() {
  return (
    <div className={styles.landingPage}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoSquare}></span>
          <span>Streakify</span>
        </div>
        <Link href="/login" className={styles.goToApp}>
          Go to App
        </Link>
      </header>

      <div className={styles.mainContent}>
        <h1 className={styles.tagline}>
          Every day, it gets a little easier.
          <br />
          But you gotta do it every day, that's the hard part.
        </h1>
        <p className={styles.subTagline}>
          Start building good habits today. Track your progress, stay motivated, and achieve your goals.
        </p>
        <Link href="/signup" className={styles.actionButton}>
          Do it every day!
        </Link>
      </div>
    </div>
  );
}
