import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-befast-primary/10 to-white relative">
      <div className="absolute inset-0 -z-10">
        <Image src="/befast-bg.jpg" alt="BeFast" fill className="object-cover blur-sm opacity-40" />
      </div>
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white/80 rounded-xl shadow-lg p-8 max-w-lg w-full flex flex-col items-center gap-8 mt-12">
          <Image src="/befast-logo.png" alt="BeFast Logo" width={120} height={120} className="mb-2" />
          <h1 className="text-3xl font-bold text-befast-primary mb-2">Bienvenido a BeFast</h1>
          <p className="text-gray-700 text-center mb-4">El ecosistema de logística y delivery más eficiente de México.</p>
          <div className="flex flex-col gap-4 w-full">
            <a href="https://order.befastmarket.com/" target="_blank" rel="noopener" className="w-full bg-befast-primary text-white font-semibold py-3 rounded-lg text-center hover:bg-befast-primary-dark transition">BeFast Market</a>
            <Link href="/delivery/login" className="w-full bg-befast-secondary text-white font-semibold py-3 rounded-lg text-center hover:bg-befast-secondary-dark transition">BeFast Delivery</Link>
            <Link href="/drivers/login" className="w-full bg-befast-accent text-white font-semibold py-3 rounded-lg text-center hover:bg-befast-accent-dark transition">BeFast Repartidores</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}