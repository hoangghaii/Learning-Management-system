import { CloudinaryModule } from '@/cloudinary/cloudinary.module';
import { RedisCacheModule } from '@/redis-cache/redis-cache.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { Course, CourseSchema } from './schemas/course.schema';

@Module({
  controllers: [CourseController],
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    RedisCacheModule,
  ],
  providers: [CourseService],
})
export class CourseModule {}
