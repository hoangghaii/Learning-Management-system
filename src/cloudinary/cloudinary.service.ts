import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

import { CloudinaryResponse } from './cloudinary/cloudinary-response';
import { UploadDto } from './dto/upload.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  uploadFile(
    file: Express.Multer.File,
    body: UploadDto,
  ): Promise<CloudinaryResponse> {
    try {
      const { type } = body;

      return new Promise<CloudinaryResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: type, use_filename: true },
          (error, result) => {
            if (error) return reject(error);

            resolve(result);
          },
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
