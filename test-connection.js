
require('dotenv').config();
const { Client } = require('pg');

console.log('Testing connection to:', process.env.DB_URL ? 'URL found' : 'URL missing');

const client = new Client({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false // This allows self-signed certs which is often needed for cloud DBs from local
    }
});

const timeout = setTimeout(() => {
    console.error('Connection timed out after 5000ms');
    process.exit(1);
}, 5000);

client.connect()
    .then(() => {
        clearTimeout(timeout);
        console.log('Connected successfully with SSL!');
        return client.end();
    })
    .catch(err => {
        clearTimeout(timeout);
        console.error('Connection failed with SSL:', err.message);
        process.exit(1);
    });
