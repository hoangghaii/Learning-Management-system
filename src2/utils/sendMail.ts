import 'dotenv/config';
import ejs from 'ejs';
import nodemailer, { Transporter } from 'nodemailer';
import path from 'path';

interface IEmailOptions {
  data: {
    [key: string]: any;
  };
  email: string;
  subject: string;
  template: string;
}

export const sendMail = async (options: IEmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    auth: {
      pass: process.env.SMTP_PASSWORD,
      user: process.env.SMTP_USER,
    },
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    service: process.env.SMTP_SERVICE,
  });

  const { data, email, subject, template } = options;

  const html = await ejs.renderFile(
    path.join(__dirname, `../mails/${template}`),
    data,
  );

  const mailOptions = {
    from: process.env.SMTP_FROM,
    html,
    subject,
    to: email,
  };

  await transporter.sendMail(mailOptions);
};
