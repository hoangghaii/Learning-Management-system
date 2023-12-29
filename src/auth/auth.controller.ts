import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { ActivateUserDto, LoginDto, RegisterDto } from './dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('active-account')
  activeAccount(@Body() body: ActivateUserDto) {
    return this.authService.activeAccount(body);
  }

  @Post('login')
  login(@Body() body: LoginDto, @Res() res: Response) {
    return this.authService.login(body, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    return this.authService.logout(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('refresh-token')
  refreshToken(@Req() req: Request, @Res() res: Response) {
    return this.authService.updateAccessToken(req, res);
  }

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
}
