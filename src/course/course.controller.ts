import { Roles } from '@/auth/decorator/roles.decorator';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { UserRole } from '@/consts';
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';

import { CourseService } from './course.service';
import { CreateCourseDto } from './dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Roles(UserRole.ADMIN)
  @Post('create')
  @HttpCode(200)
  createCourse(@Body() body: CreateCourseDto) {
    return this.courseService.createCourse(body);
  }
}
