import './globals.css';

export const metadata = {
  title: 'Everyday - Habit Tracker',
  description: 'Track your habits every day and achieve your goals.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
