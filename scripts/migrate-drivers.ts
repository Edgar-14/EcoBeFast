import * as admin from "firebase-admin";
import { readFileSync } from "fs";
import { join } from "path";

// Cargar credenciales de servicio
const serviceAccountPath = join(__dirname, "../service-account.json");
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

const DRIVERS_TO_MIGRATE = [
  { fullName: "Ejemplo Uno", phone: "+521234567890", email: "ejemplo1@befast.com" },
  { fullName: "Ejemplo Dos", phone: "+521234567891", email: "ejemplo2@befast.com" },
  // Agrega más repartidores aquí...
];

const migrateDrivers = async () => {
  for (const driver of DRIVERS_TO_MIGRATE) {
    try {
      const user = await auth.createUser({
        email: driver.email,
        password: "driver1234",
        displayName: driver.fullName,
        phoneNumber: driver.phone,
      });
      await db.collection("drivers").doc(user.uid).set({
        fullName: driver.fullName,
        email: driver.email,
        phone: driver.phone,
        status: "ACTIVE",
        createdAt: new Date(),
      });
      console.log("✅ Migrado:", driver.email);
    } catch (e) {
      console.log("⚠️ Ya existe o error:", driver.email);
    }
  }
};

migrateDrivers().then(() => process.exit(0));
