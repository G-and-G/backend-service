import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import config from 'src/config';
import { welcome } from './templates/welcome';
import { initiateEmailVerification } from './templates/initiate-email-verification';
import { initiatePasswordReset } from './templates/initiate-password-reset';
import { passwordResetSuccessful } from './templates/password-reset-successful';
import { emailVerified } from './templates/email-verified';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: config().mail.service,
      port: config().mail.port,
      secure: true,
      auth: {
        user: config().mail.user,
        pass: config().mail.password,
      },
    });
  }

  async sendWelcomeEmail({ names, email }: { email: string; names: string }) {
    const mailOptions: nodemailer.SendMailOptions = {
      to: email,
      subject: 'Welcome to Liquor Store',
      html: welcome({ names }),
    };
    console.log('[APPLICATION LOG]: Sending welcome email to ' + email);
    await this.transporter.sendMail(mailOptions);
  }

  async sendInitiateEmailVerificationEmail({
    email,
    verificationCode,
    names,
  }: {
    email: string;
    verificationCode: string;
    names: string;
  }) {
    console.log(config().mail.user);
    const mailOptions: nodemailer.SendMailOptions = {
      to: email,
      subject: 'Verify your email address',
      html: initiateEmailVerification({ names, verificationCode }),
    };
    console.log('[APPLICATION LOG]: Sending email verification to ' + email);
    await this.transporter.sendMail(mailOptions);
  }

  async sendInitiatePasswordResetEmail({
    email,
    token,
    names,
  }: {
    email: string;
    token: string;
    names: string;
  }) {
    const mailOptions: nodemailer.SendMailOptions = {
      to: email,
      subject: 'Reset your password',
      html: initiatePasswordReset({ token, names }),
    };
    console.log(
      '[APPLICATION LOG]: Sending password reset initialization to ' + email,
    );
    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetSuccessfulEmail({
    email,
    names,
  }: {
    email: string;
    token: string;
    names: string;
  }) {
    const mailOptions: nodemailer.SendMailOptions = {
      to: email,
      subject: 'Password reset successful',
      html: passwordResetSuccessful({ names }),
    };
    console.log('[APPLICATION LOG]: Sending password successful to ' + email);
    await this.transporter.sendMail(mailOptions);
  }

  async sendEmailVerificationSuccessfulEmail({
    email,
    names,
  }: {
    email: string;
    token: string;
    names: string;
  }) {
    const mailOptions: nodemailer.SendMailOptions = {
      to: email,
      subject: 'Password reset successful',
      html: emailVerified({ names }),
    };
    console.log(
      '[APPLICATION LOG]: Sending email verification successful to ' + email,
    );
    await this.transporter.sendMail(mailOptions);
  }
  async sendResetPasswordEmail({
    email,
    token,
    names,
  }: {
    email: string;
    token: string;
    names: string;
  }) {
    try {
      // Send the initiate password reset email
      await this.sendInitiatePasswordResetEmail({ email, token, names });
      console.log(
        '[APPLICATION LOG]: Password reset email sent successfully to ' + email,
      );
    } catch (error) {
      console.log(
        '[APPLICATION LOG]: Error sending password reset email to ' + email,
        error,
      );
      throw error;
    }
  }
}
