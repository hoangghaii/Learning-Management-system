import { ACCEPT_FILE_TYPE } from '@/consts';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File) {
    const fileType = value.mimetype.split('/')[1];

    if (ACCEPT_FILE_TYPE.indexOf(value.mimetype) === -1) {
      throw new BadRequestException(`File type ${fileType} is not allowed`);
    }

    // const oneKb = 1000;

    // if (value.size > oneKb) {
    //   throw new BadRequestException(`File size is too large`);
    // }

    return value;
  }
}
