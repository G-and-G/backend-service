import admin from 'firebase-admin';

const serviceAccount = require(`../../grabngo-a3844-firebase-adminsdk-ftno0-c4b08dfd02.json`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL
});

export const messaging = admin.messaging();