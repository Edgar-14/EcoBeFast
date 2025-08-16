import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold text-befast-primary mb-4">Contacto y Soporte</h3>
          <ul className="space-y-2">
            <li><a href="https://wa.me/5213121905494" target="_blank" rel="noopener noreferrer" className="hover:text-befast-primary transition-colors">WhatsApp Soporte</a></li>
            <li><a href="mailto:soporte@befastapp.com.mx" className="hover:text-befast-primary transition-colors">Email Soporte</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold text-befast-primary mb-4">Redes Sociales</h3>
          <ul className="space-y-2">
            <li><a href="https://www.facebook.com/befastmarket1/" target="_blank" rel="noopener noreferrer" className="hover:text-befast-primary transition-colors">Facebook</a></li>
            <li><a href="https://www.instagram.com/befastmarket/" target="_blank" rel="noopener noreferrer" className="hover:text-befast-primary transition-colors">Instagram</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold text-befast-primary mb-4">Legal y Administrativo</h3>
          <ul className="space-y-2">
            <li><Link href="/terms" className="hover:text-befast-primary transition-colors">Términos y Condiciones</Link></li>
            <li><Link href="/privacy" className="hover:text-befast-primary transition-colors">Política de Privacidad</Link></li>
            <li><Link href="/admin/login" className="hover:text-befast-primary transition-colors">Admin Login</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
        <p>&copy; {new Date().getFullYear() + 1} BeFast. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
