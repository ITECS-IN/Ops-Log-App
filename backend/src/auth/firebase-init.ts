import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables before initializing Firebase
dotenv.config({ path: join(__dirname, '../../.env') });

if (!admin.apps.length) {
  const serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    // databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export default admin;
