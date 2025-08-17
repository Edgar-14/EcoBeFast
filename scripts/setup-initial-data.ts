import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';
import { join } from 'path';

// Cargar las credenciales de servicio (service-account.json)
const serviceAccountPath = join(__dirname, '../service-account.json');
let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
} catch (error) {
  console.error('FATAL: No se encontró el archivo service-account.json.');
  process.exit(1);
}

// Inicializar Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

const db = getFirestore();
const auth = getAuth();

async function setupInitialData() {
  console.log('Setting up initial BeFast application data...');

  const batch = db.batch();

  // Configuración global
  const configRef = db.collection('configuration').doc('app_settings');
  batch.set(configRef, {
    appName: 'BeFast Delivery',
    version: '1.0.0',
    maintenanceMode: false,
    orderSettings: {
      maxDistanceKm: 50,
      maxOrdersPerDriver: 50,
      commissionRates: {
        business: 0.15,
        driver: 0.85,
      },
    },
  });

  // Puedes agregar más colecciones y documentos aquí...

  await batch.commit();
  console.log('✅ Configuración inicial creada/actualizada.');
}

setupInitialData().then(() => process.exit(0));
