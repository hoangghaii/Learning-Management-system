import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MailService } from './mail.service';

@Global()
@Module({
  exports: [MailService],
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        defaults: {
          from: `"No Reply" <${configService.get<string>('SMTP_FROM')}> `,
        },
        template: {
          adapter: new EjsAdapter(),
          dir: __dirname + '/templates',
          options: {
            strict: false,
          },
        },
        transport: {
          auth: {
            pass: configService.get<string>('SMTP_PASSWORD'),
            user: configService.get<string>('SMTP_USER'),
          },
          host: configService.get<string>('SMTP_HOST'),
          secure: false,
          service: configService.get<string>('SMTP_SERVICE'),
        },
      }),
    }),
  ],
  providers: [MailService],
})
export class MailModule {}
