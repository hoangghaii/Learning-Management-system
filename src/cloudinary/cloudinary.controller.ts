import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { FileSizeValidationPipe } from '@/user/pipe/file-validator.pipe';
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CloudinaryService } from './cloudinary.service';
import { UploadDto } from './dto/upload.dto';

@UseGuards(JwtAuthGuard)
@Controller('upload')
export class CloudinaryController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(new FileSizeValidationPipe())
    file: Express.Multer.File,
    @Body() body: UploadDto,
  ) {
    return this.cloudinaryService.uploadFile(file, body);
  }
}
