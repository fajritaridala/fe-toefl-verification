import Header from '@/components/common/Header';
import HomePage from '@/components/views/Home';

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <Header />
      <HomePage />
    </main>
  );
}
