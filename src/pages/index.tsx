import Header from '@/components/common/Header';
import HomePage from '@/components/views/Home';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export default function Home() {
  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${poppins.className}`}>
      <Header />
      <HomePage />
    </main>
  );
}
