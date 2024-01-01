import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { UpdateInfoDto, UpdatePasswordDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: Request, @Res() res: Response) {
    return this.userService.getMe(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-info')
  @HttpCode(200)
  updateInfo(@Req() req: Request, @Body() body: UpdateInfoDto) {
    return this.userService.updateInfo(req, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-password')
  @HttpCode(200)
  updatePassword(@Req() req: Request, @Body() body: UpdatePasswordDto) {
    return this.userService.updatePassword(req, body);
  }
}
