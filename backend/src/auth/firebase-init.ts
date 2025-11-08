import * as admin from 'firebase-admin';

import * as path from 'path';
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      path.resolve(__dirname, '../../firebase-service-account.json'),
    ),
    // databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export default admin;
