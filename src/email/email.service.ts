import * as nodemailer from 'nodemailer';
import * as nodemailerExpressHandlebars from 'nodemailer-express-handlebars';
import { join } from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSEMAIL,
      },
    });

    // Sử dụng cú pháp import để thêm handlebars
    this.transporter.use(
      'compile',
      nodemailerExpressHandlebars({
        viewEngine: {
          extname: '.hbs',
          layoutsDir: join('src/email/templates'),
          defaultLayout: false,
          partialsDir: join('src/email/templates'),
        },
        viewPath: join('src/email/templates'),
        extName: '.hbs',
      }),
    );
  }

  async sendMail(
    to: string,
    subject: string,
    template: string,
    context: any,
  ): Promise<void> {
    const mailOptions = {
      from: '"batdongsanvn" <batdongsanvn@gmail.com>',
      to,
      subject,
      template,
      context,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
