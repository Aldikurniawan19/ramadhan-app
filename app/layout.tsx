import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from './components/AuthProvider';

export const metadata: Metadata = {
  title: 'Aplikasi Ramadhan',
  description: 'Aplikasi Ramadhan - Tracker Ibadah Harian',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="text-r-light antialiased bg-r-dark">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
