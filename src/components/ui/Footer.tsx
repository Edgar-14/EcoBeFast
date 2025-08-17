import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12 py-6 px-4 text-center text-sm text-gray-600">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center max-w-5xl mx-auto gap-2">
        <div className="flex flex-col md:flex-row md:gap-6 gap-2 items-center">
          <span>Contacto: <a href="https://wa.me/5213121905494" target="_blank" rel="noopener" className="text-befast-primary hover:underline">WhatsApp</a> | <a href="mailto:soporte@befastapp.com.mx" className="text-befast-primary hover:underline">soporte@befastapp.com.mx</a></span>
          <span>Facebook: <a href="https://www.facebook.com/befastmarket1/" target="_blank" rel="noopener" className="text-befast-primary hover:underline">/befastmarket1</a></span>
          <span>Instagram: <a href="https://www.instagram.com/befastmarket/" target="_blank" rel="noopener" className="text-befast-primary hover:underline">@befastmarket</a></span>
        </div>
        <div className="flex flex-col md:flex-row md:gap-6 gap-2 items-center">
          <Link href="/terms" className="hover:underline">Términos y Condiciones</Link>
          <Link href="/privacy" className="hover:underline">Política de Privacidad</Link>
          <Link href="/admin/login" className="hover:underline font-semibold">Admin Login</Link>
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-400">© 2025 BeFast. Todos los derechos reservados.</div>
    </footer>
  );
}
