import { AuthModule } from '@/auth/auth.module';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';
import { CourseModule } from '@/course/course.module';
import { MailModule } from '@/mail/mail.module';
import { RedisCacheModule } from '@/redis-cache/redis-cache.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    AuthModule,
    MailModule,
    UserModule,
    CloudinaryModule,
    RedisCacheModule,
    CourseModule,
  ],
  providers: [],
})
export class AppModule {}
