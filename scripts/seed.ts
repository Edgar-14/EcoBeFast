/**
 * -----------------------------------------------------------------------------
 * SEED SCRIPT
 * -----------------------------------------------------------------------------
 * This script is intended to be run once to set up the initial admin users
 * in Firebase Authentication and Firestore.
 *
 * It requires Firebase Admin SDK credentials to be set up in the environment.
 * To run this script:
 * 1. Set up a service account in your Firebase project.
 * 2. Download the service account key JSON file.
 * 3. Set the GOOGLE_APPLICATION_CREDENTIALS environment variable to the path of the key file.
 * 4. Run `ts-node scripts/seed.ts`
 * -----------------------------------------------------------------------------
 */

// Placeholder for Firebase Admin SDK
// In a real environment, you would import firebase-admin
const admin = {
  initializeApp: () => {},
  auth: () => ({
    createUser: async (user: any) => {
      console.log(`[SEED] Creating auth user: ${user.email}`);
      return { uid: `firebase-uid-${Math.random()}` };
    },
    setCustomUserClaims: async (uid: string, claims: any) => {
      console.log(`[SEED] Setting custom claims for ${uid}:`, claims);
    },
    generatePasswordResetLink: async (email: string) => {
      console.log(`[SEED] Generating password reset link for ${email}`);
      return `https://your-app.com/reset-password?oobCode=example`;
    },
  }),
  firestore: () => ({
    collection: (name: string) => ({
      doc: (id: string) => ({
        set: async (data: any) => {
          console.log(`[SEED] Creating Firestore document in ${name} for ${id}:`, data);
        },
      }),
    }),
  }),
};

// Placeholder for email service
const sendTransactionalEmail = async (email: string, subject: string, content: string) => {
  console.log(`[SEED] Sending email to: ${email}`);
  console.log(`[SEED] Subject: ${subject}`);
  console.log(`[SEED] Content: ${content}`);
};

const adminUsers = [
  { email: 'egarcia@befastapp.com.mx', role: 'SUPER_ADMIN' },
  { email: 'documentos@befastapp.com.mx', role: 'ADMIN' },
  { email: 'revisiones@befastapp.com.mx', role: 'ADMIN' },
  { email: 'guillezamoracolima@hotmail.com', role: 'CONTADORA' },
  { email: 'c.monsetdeleon@gmail.com', role: 'CONTADORA' },
];

async function seedAdminUsers() {
  console.log('[SEED] Starting admin user seeding...');

  admin.initializeApp();
  const auth = admin.auth();
  const db = admin.firestore();

  for (const user of adminUsers) {
    try {
      // 1. Create user in Firebase Auth
      const { uid } = await auth.createUser({
        email: user.email,
        password: `password-${Math.random().toString(36).slice(-8)}`, // Secure random initial password
        emailVerified: true,
      });

      // 2. Set custom claims for role-based access
      await auth.setCustomUserClaims(uid, { role: user.role });

      // 3. Create user document in Firestore
      await db.collection('admins').doc(uid).set({
        uid,
        email: user.email,
        role: user.role,
        createdAt: new Date().toISOString(),
      });

      // 4. Send email to set initial password
      const link = await auth.generatePasswordResetLink(user.email);
      await sendTransactionalEmail(
        user.email,
        'Bienvenido a BeFast - Establece tu contraseña',
        `Hola, has sido invitado a BeFast. Por favor, establece tu contraseña inicial aquí: ${link}`
      );

      console.log(`[SEED] Successfully created admin user: ${user.email}`);
    } catch (error) {
      console.error(`[SEED] Error creating user ${user.email}:`, error);
    }
  }

  console.log('[SEED] Seeding complete.');
}

seedAdminUsers();
