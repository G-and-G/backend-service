/* eslint-disable @typescript-eslint/no-var-requires */
// import Flutterwave from 'flutterwave-node-v3';
const Flutterwave = require('flutterwave-node-v3');
import 'dotenv/config';

console.log('process.env.FLW_SECRET_KEY', process.env.FLW_SECRET_KEY);

const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY,
);

export default flw;
