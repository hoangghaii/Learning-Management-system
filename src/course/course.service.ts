import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateCourseDto } from './dto';
import { Course } from './schemas/course.schema';

@Injectable()
export class CourseService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(Course.name) private courseModel: Model<Course>,
  ) {}

  async createCourse(body: CreateCourseDto) {
    try {
      const course = await this.courseModel.create(body);

      return {
        course,
        success: true,
      };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(error.message);
    }
  }
}
