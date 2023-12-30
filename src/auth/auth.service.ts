import { MailService } from '@/mail/mail.service';
import { _log } from '@/utils/_log';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { Model } from 'mongoose';

import { ActivateUserDto, LoginSocialDto, RegisterDto } from './dto';
import { LoginDto } from './dto/login.dto';
import { User } from './schemas/user.schema';

type TokenOptionsType = {
  expires: Date;
  httpOnly: boolean;
  maxAge: number;
  sameSite: 'lax' | 'none' | 'strict' | undefined;
  secure: boolean;
};

// Pares environment variable to intergers with fallback values
const accessTokenExpires = parseInt(
  process.env.ACCESS_TOKEN_EXPIRES || '300',
  10,
);

const refreshTokenExpires = parseInt(
  process.env.REFRESH_TOKEN_EXPIRES || '1200',
  10,
);

// Options for cookies
const accessTokenOptions: TokenOptionsType = {
  expires: new Date(Date.now() + accessTokenExpires * 60 * 60 * 1000),
  httpOnly: true,
  maxAge: accessTokenExpires * 60 * 60 * 1000,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

const refreshTokenOptions: TokenOptionsType = {
  expires: new Date(Date.now() + refreshTokenExpires * 24 * 60 * 60 * 1000),
  httpOnly: true,
  maxAge: refreshTokenExpires * 24 * 60 * 60 * 1000,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  /**
   * @method activeAccount
   * @description Active account
   * @param body ActivateUserDto
   * @returns
   */
  async activeAccount(body: ActivateUserDto) {
    try {
      const { code, token } = body;

      const { activationCode, user } = (await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      )) as { activationCode: string; user: User };

      if (activationCode !== code) {
        throw new UnauthorizedException('Invalid activation code');
      }

      const exisUser = await this.userModel.findOne({ email: user.email });

      if (!exisUser) {
        throw new UnauthorizedException('Invalid activation code');
      }

      exisUser.isVerified = true;

      await exisUser.save();

      return {
        message: 'Your account has been activated',
        success: true,
      };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  /**
   * @method createActivationToken
   * @description Create activation token
   * @param user User
   * @returns activationCode, token
   */
  createActivationToken(user: User): { activationCode: string; token: string } {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.jwtService.sign(
      { activationCode, user },
      {
        expiresIn: '5m',
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );

    return { activationCode, token };
  }

  /**
   * @method login
   * @description Login user
   * @param loginDto LoginDto
   * @param res Response
   */
  async login(loginDto: LoginDto, res: Response) {
    try {
      const { email, password } = loginDto;

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const exisUser = await this.userModel
        .findOne({ email })
        .select('+password');

      if (!exisUser) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordMatch = await exisUser.comparePassword(password);

      if (!isPasswordMatch) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isVerified = exisUser.isVerified;

      if (!isVerified) {
        throw new UnauthorizedException('Please verify your email');
      }

      return this.sendToken(exisUser, 200, res);
    } catch (error: any) {
      throw new ForbiddenException(error.message);
    }
  }

  /**
   * @method loginSocial
   * @description Login social
   * @param body LoginSocialDto
   * @param res Response
   */
  async loginSocial(body: LoginSocialDto, res: Response) {
    try {
      const { avatar, email, name } = body;

      const user = await this.userModel.findOne({ email });

      if (!user) {
        const newUser = await this.userModel.create({
          avatar,
          email,
          isVerified: true,
          name,
        });

        this.sendToken(newUser, 200, res);
      } else {
        user.avatar = avatar;

        user.isVerified = true;

        user.name = name;

        await user.save();

        this.sendToken(user, 200, res);
      }
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  /**
   * @method logout
   * @description Logout user
   * @param req Request
   * @param res Response
   * @returns
   */
  logout(req: Request, res: Response) {
    try {
      res.cookie('accessToken', '', { maxAge: 1 });

      res.cookie('refreshToken', '', { maxAge: 1 });

      _log('running here');

      return res.status(200).json({
        message: 'Logged out successfully',
        success: true,
      });
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  /**
   * @method register
   * @description Register user
   * @param registerDto RegisterDto
   */
  async register(registerDto: RegisterDto) {
    try {
      const { avatar, email, name, password } = registerDto;

      const isEmailExisted = await this.userModel.findOne({ email });

      if (isEmailExisted) {
        throw new BadRequestException('Email already exists');
      }

      const newUser = await this.userModel.create({
        avatar,
        email,
        name,
        password,
      });

      delete newUser.password;

      const { activationCode, token } = this.createActivationToken(newUser);

      const data = {
        activationCode,
        email: newUser.email,
        name: newUser.name,
      };

      try {
        await this.mailService.sendActivationMail(data);

        return {
          message: 'Please check your email to activate your account',
          success: true,
          token,
        };
      } catch (error: any) {
        throw new ForbiddenException(error.message);
      }
    } catch (error: any) {
      throw new ForbiddenException(error.message);
    }
  }

  /**
   * @method sendToken
   * @description Send token to client
   * @param user User
   * @param statusCode number
   * @param res Response
   */
  sendToken(user: User, statusCode: number, res: Response) {
    const accessToken = this.jwtService.sign(
      {
        sub: user._id,
        username: user.name,
      },
      {
        expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        sub: user._id,
        username: user.name,
      },
      {
        expiresIn: '3d',
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );

    res.cookie('accessToken', accessToken, accessTokenOptions);

    res.cookie('refreshToken', refreshToken, refreshTokenOptions);

    const userObj = user.toObject();

    delete userObj.password;

    res.status(statusCode).json({
      success: true,
      user: userObj,
    });
  }

  async updateAccessToken(req: Request, res: Response) {
    try {
      const refresh_token: string = req.cookies.refreshToken;

      if (!refresh_token) {
        throw new UnauthorizedException('Please login');
      }

      const decoded = this.jwtService.verify(
        refresh_token,
        this.configService.get('JWT_SECRET'),
      );

      if (!decoded) {
        throw new UnauthorizedException('Please login');
      }

      const user = await this.userModel.findOne({ _id: decoded.sub });

      const accessToken = this.jwtService.sign(
        {
          sub: user._id,
          username: user.name,
        },
        {
          expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );

      const refreshToken = this.jwtService.sign(
        {
          sub: user._id,
          username: user.name,
        },
        {
          expiresIn: '3d',
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );

      res.cookie('accessToken', accessToken, accessTokenOptions);

      res.cookie('refreshToken', refreshToken, refreshTokenOptions);

      return res.status(200).json({
        accessToken,
        success: true,
      });
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  /**
   * @method validateAccount
   * @description Validate account
   * @param req Request
   * @returns
   */
  async validateAccount({ sub }: { sub: string; username: string }) {
    try {
      const user = await this.userModel.findOne({ _id: sub });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user.toObject();
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
