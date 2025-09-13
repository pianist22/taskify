import Navbar from '@/components/navbar';
import HeroHeading from '@/components/hero-heading';
import ThemeAwareButton from '@/components/theme-aware-button';

export default function Home() {
  return (
    <>
      <main className="mx-auto max-w-6xl px-4 py-12 space-y-6">
        <HeroHeading />
        <ThemeAwareButton />
      </main>
    </>
  );
}
