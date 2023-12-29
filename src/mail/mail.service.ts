import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendActivationMail(user: {
    activationCode: string;
    email: string;
    name: string;
  }) {
    await this.mailerService.sendMail({
      context: {
        activationCode: user.activationCode,
        userName: user.name,
      },
      subject: 'Account activation code',
      template: 'activation-mail',
      to: user.email,
    });
  }
}
