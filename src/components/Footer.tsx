import Link from 'next/link';
import { FaInstagram, FaFacebook, FaEnvelope, FaPhone, FaUserShield } from 'react-icons/fa';

const Footer = () => {
  return (
  <footer className="w-full py-8 px-4 border-t border-blue-100 bg-white/60 backdrop-blur-md shadow-inner">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex flex-row space-x-6 text-2xl">
          <a href="https://www.instagram.com/befastmarket/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-befast-primary"><FaInstagram /></a>
          <a href="https://www.facebook.com/befastmarket1/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-befast-primary"><FaFacebook /></a>
          <a href="mailto:soporte@befastapp.com.mx" aria-label="Email" className="hover:text-befast-primary"><FaEnvelope /></a>
          <a href="https://wa.me/5213121905494" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-befast-primary"><FaPhone /></a>
          <Link href="/admin/login" aria-label="Admin" className="hover:text-befast-primary"><FaUserShield /></Link>
        </div>
        <div className="text-center text-xs mt-2">
          <div>© 2025 BeFast. Todos los derechos reservados.</div>
          <div className="space-x-2 mt-1">
            <Link href="/terms" className="hover:underline">Términos y Condiciones</Link>
            <span>|</span>
            <Link href="/privacy" className="hover:underline">Política de Privacidad</Link>
            <span>|</span>
            <Link href="/admin/login" className="hover:underline">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
