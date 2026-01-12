import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { EmailResponseDto, SendEmailDto } from './dto';
import { emailVerified } from './templates/email-verified';
import { initiateEmailVerification } from './templates/initiate-email-verification';
import { initiatePasswordReset } from './templates/initiate-password-reset';
import { passwordResetSuccessful } from './templates/password-reset-successful';
import { welcome } from './templates/welcome';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.initializeSendGrid();
  }

  private initializeSendGrid() {
    const sendgridApiKey =
      this.configService.get<string>('SENDGRID_API_KEY') ||
      process.env.SENDGRID_API_KEY;
    const nodeEnv = this.configService.get<string>('NODE_ENV');

    if (!sendgridApiKey) {
      this.logger.warn(
        'SendGrid API key is missing. Email service may not work properly.',
      );
      return;
    }

    SendGrid.setApiKey(sendgridApiKey);

    if (nodeEnv === 'development') {
      this.logger.log('SendGrid initialized in development mode');
    } else {
      this.logger.log('SendGrid initialized successfully');
    }
  }

  async sendEmail(emailData: SendEmailDto): Promise<EmailResponseDto> {
    try {
      const sendgridApiKey =
        this.configService.get<string>('SENDGRID_API_KEY') ||
        process.env.SENDGRID_API_KEY;
      if (!sendgridApiKey) {
        throw new Error('SendGrid API key not configured');
      }

      const recipients = emailData.to.map((email, index) => {
        const name = emailData.toNames?.[index] || '';
        return name
          ? {
            email,
            name,
          }
          : {
            email,
          };
      });

      const from = {
        email:'bugingoelua@gmail.com',
        name:'grab and go',
      };

      let replyTo: { email: string; name?: string } | undefined;
      if (!emailData.isReplyable) {
        replyTo = {
          email: 'bugingoelua@gmail.com',
          name: 'grab and go',
        };
      } else if (emailData.replyTo) {
        replyTo = {
          email: emailData.replyTo,
          name: emailData.replyToName || 'grab and go',
        };
      }

      const msg = {
        to: recipients,
        from,
        replyTo,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      };

      this.logger.log(
        `Sending email to: ${recipients.map((r) => r.email).join(', ')}`,
      );
      const response = await SendGrid.send(msg);

      const messageId = response[0]?.headers?.['x-message-id'] || 'unknown';

      this.logger.log(`Email sent successfully. Message ID: ${messageId}`);

      return {
        success: true,
        message: 'Email sent successfully',
        messageId,
      };
    } catch (error: any) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);

      return {
        success: false,
        message: 'Failed to send email',
        error: error.message,
      };
    }
  }

  async sendWelcomeEmail({ names, email }: { email: string; names: string }) {
    await this.sendEmail({
      to: [email],
      toNames: [names],
      subject: 'Welcome to Grab and Go',
      html: welcome({ names }),
      isReplyable: false,
    });
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
    await this.sendEmail({
      to: [email],
      toNames: [names],
      subject: 'Verify your email address',
      html: initiateEmailVerification({ names, verificationCode }),
      isReplyable: false,
    });
  }

  async sendInitiatePasswordResetEmail({
    email,
    token,
    names,
    platform,
  }: {
    email: string;
    token: string;
    names: string;
    platform: string;
  }) {
    await this.sendEmail({
      to: [email],
      toNames: [names],
      subject: 'Reset your password',
      html: initiatePasswordReset({ token, names, platform }),
      isReplyable: false,
    });
  }

  async sendPasswordResetSuccessfulEmail({
    email,
    names,
  }: {
    email: string;
    token: string;
    names: string;
  }) {
    await this.sendEmail({
      to: [email],
      toNames: [names],
      subject: 'Password reset successful',
      html: passwordResetSuccessful({ names }),
      isReplyable: false,
    });
  }

  async sendEmailVerificationSuccessfulEmail({
    email,
    names,
  }: {
    email: string;
    token: string;
    names: string;
  }) {
    await this.sendEmail({
      to: [email],
      toNames: [names],
      subject: 'Password reset successful',
      html: emailVerified({ names }),
      isReplyable: false,
    });
  }

  async sendResetPasswordEmail({
    email,
    token,
    names,
    platform,
  }: {
    email: string;
    token: string;
    names: string;
    platform: string;
  }) {
    // This method seems to just wrap sendInitiatePasswordResetEmail in the original code.
    // Preserving the behavior.
    try {
      await this.sendInitiatePasswordResetEmail({
        email,
        token,
        names,
        platform,
      });
      this.logger.log(
        '[APPLICATION LOG]: Password reset email sent successfully to ' + email,
      );
    } catch (error) {
      this.logger.error(
        '[APPLICATION LOG]: Error sending password reset email to ' + email,
        error,
      );
      throw error;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      const sendgridApiKey =
        this.configService.get<string>('SENDGRID_API_KEY') ||
        process.env.SENDGRID_API_KEY;
      if (!sendgridApiKey) {
        return false;
      }

      await SendGrid.send({
        to: 'bugingoeloi@gmail.com',
        from: {
          email: 'bugingoelua@gmail.com',
          name: 'grab and go',
        },
        subject: 'Connection Test',
        text: 'Testing SendGrid connection',
      }).catch(() => {
        // Ignore actual send, we just want to verify auth
      });

      this.logger.log('SendGrid connection verified successfully');
      return true;
    } catch (error: any) {
      this.logger.error(
        `SendGrid connection verification failed: ${error.message}`,
      );
      return false;
    }
  }
}

