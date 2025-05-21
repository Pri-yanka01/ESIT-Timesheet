import '../styles/globals.css';
import Header from '../components/Header';

export const metadata = {
  title: 'Timesheet App',
  description: 'A simple timesheet application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
} 