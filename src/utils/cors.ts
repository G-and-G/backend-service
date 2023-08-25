const whitelist = ['http://localhost:7878', 'http://localhost:5000'];
const options = {
  origin: (origin: string, callback: Function) => {
    console.log(origin);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  credentials: true,
  exposedHeaders: ['*', 'Authorization'],
};

export default options;
