import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateCourseDto, UpdateCourseDto } from './dto';
import { Course } from './schemas/course.schema';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

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

  async updateCourse(id: string, body: UpdateCourseDto) {
    try {
      const course = await this.courseModel.findByIdAndUpdate(
        id,
        {
          $set: body,
        },
        {
          new: true,
        },
      );

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
