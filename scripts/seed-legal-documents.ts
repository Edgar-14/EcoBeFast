import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

// Cargar las credenciales de servicio
const serviceAccountPath = join(__dirname, '../service-account.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const seedLegalDocuments = async () => {
  console.log('Creando/actualizando documentos legales en Firestore...');
  const batch = db.batch();

  // Términos y Condiciones
  const termsContent = `<h2>1. Aceptación de los Términos</h2><p>Al acceder y utilizar la plataforma BeFast...</p>`;
  batch.set(db.collection('legalDocuments').doc('terms'), {
    type: 'terms',
    content: termsContent,
    updatedAt: new Date(),
  });

  // Política de Privacidad
  const privacyContent = `<h2>Política de Privacidad</h2><p>BeFast protege tus datos...</p>`;
  batch.set(db.collection('legalDocuments').doc('privacy'), {
    type: 'privacy',
    content: privacyContent,
    updatedAt: new Date(),
  });

  await batch.commit();
  console.log('✅ Documentos legales creados/actualizados.');
};

seedLegalDocuments().then(() => process.exit(0));
