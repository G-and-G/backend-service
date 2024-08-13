export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  mail: {
    service: process.env.MAIL_SERVICE,
    port: parseInt(process.env.MAIL_PORT, 10) || 587,
    user: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
  },
  client: {
    url: process.env.CLIENT_URL,
  },
});
