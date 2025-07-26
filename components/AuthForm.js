'use client'; 
import { useState } from 'react';
import Link from 'next/link';
import styles from './styles/AuthForm.module.css'; 

export default function AuthForm({ type, title, subtitle, buttonText, onSubmit, errorMessage, isLoading }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'signup') {
      onSubmit({ name, email, password });
    } else {
      onSubmit({ email, password });
    }
  };

  return (
    <div className={styles.authContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span>Streakify</span>
        </div>
        <Link href="/login" className={styles.goToApp}>
          Go to App
        </Link>
      </header>

      <div className={styles.authCard}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {type === 'signup' && (
            <div className={styles.formGroup}>
              <input
                type="text"
                className={styles.inputField}
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className={styles.formGroup}>
            <input
              type="email"
              className={styles.inputField}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="password"
              className={styles.inputField}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Loading...' : buttonText}
            </button>
          </form>

          {type === 'signup' && (
            <p className={styles.termsText}>
              By signing up you are accepting streakify {''}
              <Link href="#" className={styles.termsLink}>Terms and Conditions</Link> and{' '}
              <Link href="#" className={styles.termsLink}>Privacy Policy</Link>.
            </p>
          )}
        </div>
      </div>
    );
  }
  