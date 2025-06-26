import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppUtilities } from 'src/app.utilities';
import { AUTH_MAIL } from 'src/common/constants';
import { QueueService } from 'src/common/queue/queue.service';
import { TokenService } from 'src/token/token.service';
import { User } from 'src/user/entities/user.entity';
import * as Handlebars from 'handlebars';

const { welcomeMail, confirmMail, passswordChangeMail, forgotPasswordMail } = AUTH_MAIL;

@Injectable()
export class EmailService {
  private basePath: string;
  constructor(
    private readonly queueService: QueueService,
    private readonly tokenService: TokenService,
    private readonly cfg: ConfigService,
  ) {
    this.basePath = this.cfg.get('appRoot');
  }

  private prepMailContent(filePath: string) {
    return AppUtilities.readFile(`${this.basePath}/templates/${filePath}`);
  }

  private prepMailContentForHbs(filePath: string, data: any) {
    const source = AppUtilities.readFile(`${this.basePath}/templates/${filePath}`);
    const template = Handlebars.compile(source);
    return template(data);
  }

  async sendConfirmationEmail(user: User) {
    try {
      const token = await this.tokenService.generateConfirmationToken(user.id);
      const confirmUrl = `${process.env.FRONTEND_URL}/auth/login?token=${token.access_token}`;
      const htmlTemplate = this.prepMailContent('confirmEmail.html');
      const htmlContent = htmlTemplate
        .replace('{{confirmUrl}}', confirmUrl)
        .replace('{{username}}', user.last_name);

      const job = await this.queueService.addAuthMailToQueue(confirmMail, {
        from: process.env.MAIL_FROM,
        to: user.email,
        subject: 'Confirm Email',
        html: htmlContent,
      });
      console.log('Email added', job);
    } catch (err) {
      console.log(err, 'err');
    }
  }

  async welcomeEmail(user: User) {
    try {
      const htmlTemplate = this.prepMailContent('welcome.html');
      const htmlContent = htmlTemplate.replace('{{username}}', user.last_name);

      const job = await this.queueService.addAuthMailToQueue(welcomeMail, {
        from: process.env.MAIL_FROM,
        to: user.email,
        subject: 'Welcome Email',
        html: htmlContent,
      });
      console.log('Email added', job);
    } catch (err) {
      console.log(err, 'err');
    }
  }

  async sendForgotPasswordEmail(user: User) {
    try {
      const token = await this.tokenService.generateForgotPasswordToken(user.id);
      const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token.access_token}`;
      const htmlTemplate = this.prepMailContent('resetPassword.html');
      const htmlContent = htmlTemplate
        .replace('{{resetUrl}}', resetUrl)
        .replace('{{username}}', user.last_name);

      const job = await this.queueService.addAuthMailToQueue(forgotPasswordMail, {
        from: process.env.MAIL_FROM,
        to: user.email,
        subject: 'Reset Password',
        html: htmlContent,
      });
      console.log('Email added', job);
    } catch (err) {
      console.log(err, 'err');
    }
  }
}
