import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import PageLoader from '@/components/shared/PageLoader';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageLoader />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
