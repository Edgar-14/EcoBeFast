import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';
// @ts-ignore
const nodemailer = require('nodemailer');

// Cargar credenciales de servicio
const serviceAccountPath = join(__dirname, '../service-account.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}

const auth = admin.auth();

// Configurar Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendWelcomeEmail = async (email: string, fullName: string) => {
  try {
    const link = await auth.generatePasswordResetLink(email);
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Bienvenido a BeFast',
      html: `<h1>¡Hola ${fullName}!</h1><p>Bienvenido a BeFast. Establece tu contraseña aquí: <a href="${link}">${link}</a></p>`
    });
    console.log('✅ Correo de bienvenida enviado a', email);
  } catch (e) {
    console.error('❌ Error enviando correo:', e);
  }
};

// Ejemplo de uso
// sendWelcomeEmail('soporte@befastapp.com.mx', 'Soporte BeFast');

export { sendWelcomeEmail };
