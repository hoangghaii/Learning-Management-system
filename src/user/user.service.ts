import { User } from '@/auth/schemas/user.schema';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { Model } from 'mongoose';

import { UpdateInfoDto, UpdatePasswordDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  /**
   * @method getMe
   * @description Get user info
   * @param req Request
   * @param res Response
   * @returns
   */
  async getMe(req: Request, res: Response) {
    try {
      const user = await this.userModel
        .findById((req as any).user._id)
        .select('-password');

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @method updateAvatar
   * @description Update user avatar
   * @param req Request
   * @param req Express.Multer.File
   */
  async updateAvatar(req: Request, file: Express.Multer.File) {
    try {
      const user = await this.userModel
        .findById((req as any).user._id)
        .select('-password');

      const { url } = await this.cloudinaryService.uploadFile(file);

      user.avatar = url;

      await user.save();

      const savedUser = await this.userModel
        .findById((req as any).user._id)
        .select('-password');

      return {
        message: 'Update avatar successfully',
        savedUser,
        success: true,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @method updateInfo
   * @description Update user info
   * @param req Request
   * @param res Response
   */
  async updateInfo(req: Request, body: UpdateInfoDto) {
    try {
      const user = await this.userModel
        .findById((req as any).user._id)
        .select('-password');

      const { avatar, email, name, role } = body;

      await this.userModel.findByIdAndUpdate(user._id, {
        avatar: avatar || user.avatar,
        email: email || user.email,
        name: name || user.name,
        role: role || user.role,
      });

      await user.save();

      const savedUser = await this.userModel
        .findById((req as any).user._id)
        .select('-password');

      return {
        message: 'Update info successfully',
        savedUser,
        success: true,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * @method updatePassword
   * @description Update user password
   * @param req Request
   * @param body UpdatePasswordDto
   */
  async updatePassword(req: Request, body: UpdatePasswordDto) {
    try {
      const user = await this.userModel
        .findById((req as any).user._id)
        .select('+password');

      const { newPassword, oldPassword } = body;

      const isPasswordMatch = await user.comparePassword(oldPassword);

      if (!isPasswordMatch) {
        throw new UnauthorizedException('Your old password is incorrect');
      }

      user.password = newPassword;

      await user.save();

      return {
        message: 'Update password successfully',
        success: true,
        user,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
