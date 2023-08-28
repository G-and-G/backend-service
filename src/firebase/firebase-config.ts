import admin from 'firebase-admin';

const serviceAccount = require(__dirname);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL
});

export const messaging = admin.messaging();