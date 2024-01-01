import { Roles } from '@/auth/decorator/roles.decorator';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import { UserRole } from '@/consts';
import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';

import { CourseService } from './course.service';
import { CreateCourseDto, UpdateCourseDto } from './dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  createCourse(@Body() body: CreateCourseDto) {
    return this.courseService.createCourse(body);
  }

  @Roles(UserRole.ADMIN)
  @Put(':id')
  updaCourse(@Param('id') id: string, @Body() body: UpdateCourseDto) {
    return this.courseService.updateCourse(id, body);
  }
}
