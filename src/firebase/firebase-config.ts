import 'dotenv/config';
import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.SECRET_JSON);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL,
});

export const messaging = admin.messaging();
