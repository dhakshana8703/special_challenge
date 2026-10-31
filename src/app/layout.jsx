import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AIRAWidget from '@/components/AIRAWidget';

export const metadata = {
  title: 'azentio.ai | Enterprise AI Website & Intelligent Collaboration Portal',
  description: 'Build intelligence. Create shared value. Governed collective learning, multi-tenant collaboration, and applied AI discovery.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <AIRAWidget />
      </body>
    </html>
  );
}
