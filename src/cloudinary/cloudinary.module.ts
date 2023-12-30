import { Module } from '@nestjs/common';

import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';

@Module({
  exports: [CloudinaryProvider, CloudinaryService],
  providers: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
