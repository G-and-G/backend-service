import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import config from 'src/config';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: config().cloudinary.cloud_name,
      api_key: config().cloudinary.api_key,
      api_secret: config().cloudinary.api_secret,
    });
  }

  async upload(fileString: string) {
    const response = await cloudinary.uploader.upload(fileString, {
      upload_preset: config().cloudinary.upload_preset,
    });
    return response.secure_url;
  }
}
