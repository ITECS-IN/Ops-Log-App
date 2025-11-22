import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mailjet from 'node-mailjet';
import type { Lead } from '../leads/schemas/lead.schema';

type LeadWithTimestamps = Lead & { createdAt?: Date | string };

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly mailjet?: Mailjet;
  private readonly fromEmail?: string;
  private readonly fromName: string;
  private readonly notificationsRecipient: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('MAILJET_API_KEY');
    const secretKey = this.configService.get<string>('MAILJET_SECRET_KEY');
    const emailFrom = this.configService.get<string>('EMAIL_FROM');

    // Parse EMAIL_FROM which is in format: '"Name" <email@domain.com>'
    const emailMatch = emailFrom?.match(/(?:"([^"]+)"\s*)?<?([^>]+)>?/);
    this.fromName = emailMatch?.[1] || 'Ops-log';
    this.fromEmail = emailMatch?.[2] || emailFrom;

    this.notificationsRecipient =
      this.configService.get<string>('LEAD_NOTIFICATION_TO') ??
      'itechlicense@outlook.com';

    if (apiKey && secretKey && this.fromEmail) {
      this.mailjet = new Mailjet({
        apiKey,
        apiSecret: secretKey,
      });
      this.logger.log('Mailjet email service initialized successfully');
    } else {
      this.logger.warn(
        'Mailjet is not configured. Set MAILJET_API_KEY, MAILJET_SECRET_KEY, and EMAIL_FROM to enable notifications.',
      );
    }
  }

  async sendLeadNotification(lead: Lead) {
    await this.send({
      to: this.notificationsRecipient,
      subject: `New Ops-log lead: ${lead.fullName}`,
      textPart: this.buildLeadText(lead),
      htmlPart: this.buildLeadHtml(lead),
    });
  }

  async sendUserWelcomeEmail(options: {
    to: string;
    temporaryPassword: string;
    companyName: string;
    role: 'admin' | 'user';
  }) {
    const subject = `Welcome to ${options.companyName} on Ops-log`;
    const textPart = this.buildWelcomeText(options);
    const htmlPart = this.buildWelcomeHtml(options);

    await this.send({
      to: options.to,
      subject,
      textPart,
      htmlPart,
    });
  }

  async sendUserPasswordResetEmail(options: {
    to: string;
    temporaryPassword: string;
    companyName: string;
    role: 'admin' | 'user';
  }) {
    const subject = `Your Ops-log password was reset`;
    const textPart = this.buildResetText(options);
    const htmlPart = this.buildResetHtml(options);

    await this.send({
      to: options.to,
      subject,
      textPart,
      htmlPart,
    });
  }

  async sendSignupWelcomeEmail(options: { to: string; companyName: string }) {
    const subject = `Welcome to Ops-log! Your account is ready`;
    const textPart = this.buildSignupWelcomeText(options);
    const htmlPart = this.buildSignupWelcomeHtml(options);

    await this.send({
      to: options.to,
      subject,
      textPart,
      htmlPart,
    });
  }

  async sendSignupNotificationToAdmin(options: {
    userEmail: string;
    companyName: string;
    fullName?: string;
  }) {
    const adminEmail =
      this.configService.get<string>('LEAD_NOTIFICATION_TO') ||
      this.notificationsRecipient;

    if (!adminEmail) {
      this.logger.warn('Admin notification email not configured, skipping notification');
      return;
    }

    const subject = `🎉 New Ops-log Free Trial Signup: ${options.companyName}`;
    const textPart = this.buildSignupNotificationText(options);
    const htmlPart = this.buildSignupNotificationHtml(options);

    await this.send({
      to: adminEmail,
      subject,
      textPart,
      htmlPart,
    });
  }

  private async send(options: {
    to: string;
    subject: string;
    textPart: string;
    htmlPart: string;
  }) {
    if (!this.mailjet || !this.fromEmail) {
      this.logger.warn('Attempted to send mail but Mailjet is not configured.');
      return;
    }

    try {
      const request = this.mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: this.fromEmail,
              Name: this.fromName,
            },
            To: [
              {
                Email: options.to,
              },
            ],
            Subject: options.subject,
            TextPart: options.textPart,
            HTMLPart: options.htmlPart,
          },
        ],
      });

      const result = await request;
      this.logger.log(
        `Email sent successfully to ${options.to} - Status: ${result.response.status}`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to send email via Mailjet: ${errorMessage}`);

      // Check for sender validation error
      if (
        errorMessage.includes('not validated') ||
        errorMessage.includes('sender')
      ) {
        this.logger.error(
          `⚠️  SENDER NOT VALIDATED: The email address '${this.fromEmail}' needs to be validated in Mailjet.`,
        );
        this.logger.error(
          `Please validate your sender at: https://app.mailjet.com/account/sender`,
        );
      }

      if (error instanceof Error && 'statusCode' in error) {
        this.logger.error(`Mailjet error details: ${JSON.stringify(error)}`);
      }
    }
  }

  private buildLeadText(lead: Lead) {
    const submitted = this.resolveSubmittedAt(lead).toISOString();
    return [
      'A new lead was captured from the Ops-log landing page.',
      `Name: ${lead.fullName}`,
      `Email: ${lead.email}`,
      `Company: ${lead.company ?? 'N/A'}`,
      `Phone: ${lead.phone ?? 'N/A'}`,
      `Source: ${lead.source ?? 'landing-page'}`,
      `CTA: ${lead.cta ?? 'N/A'}`,
      `Submitted: ${submitted}`,
      '',
      `Notes: ${lead.notes ?? 'N/A'}`,
    ].join('\n');
  }

  private buildLeadHtml(lead: Lead) {
    const submitted = this.resolveSubmittedAt(lead).toLocaleString();
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          ul { list-style: none; padding: 0; }
          li { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          li:last-child { border-bottom: none; }
          strong { color: #1f2937; }
          .notes { background-color: white; padding: 15px; border-radius: 6px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">🎯 New Ops-log Lead</h2>
          </div>
          <div class="content">
            <p>A new lead was captured from the Ops-log landing page.</p>
            <ul>
              <li><strong>Name:</strong> ${lead.fullName}</li>
              <li><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></li>
              <li><strong>Company:</strong> ${lead.company ?? 'N/A'}</li>
              <li><strong>Phone:</strong> ${lead.phone ?? 'N/A'}</li>
              <li><strong>Source:</strong> ${lead.source ?? 'landing-page'}</li>
              <li><strong>CTA:</strong> ${lead.cta ?? 'N/A'}</li>
              <li><strong>Submitted:</strong> ${submitted}</li>
            </ul>
            <div class="notes">
              <strong>Notes:</strong>
              <p>${lead.notes ?? 'N/A'}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private resolveSubmittedAt(lead: Lead) {
    const createdAt = (lead as LeadWithTimestamps).createdAt;
    if (!createdAt) {
      return new Date();
    }
    return createdAt instanceof Date ? createdAt : new Date(createdAt);
  }

  private buildWelcomeText(options: {
    to: string;
    temporaryPassword: string;
    companyName: string;
    role: 'admin' | 'user';
  }) {
    return [
      `Welcome to Ops-log!`,
      ``,
      `You've been added as a ${options.role} in ${options.companyName}.`,
      `Use the temporary password below to sign in for the first time:`,
      ``,
      `Email: ${options.to}`,
      `Temporary password: ${options.temporaryPassword}`,
      ``,
      `For security, please log in and change your password right away from the profile menu.`,
      `If you weren't expecting this invitation, contact your Ops-log administrator.`,
    ].join('\n');
  }

  private buildWelcomeHtml(options: {
    to: string;
    temporaryPassword: string;
    companyName: string;
    role: 'admin' | 'user';
  }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f9fafb; color: #111827; }
          .container { max-width: 640px; margin: 0 auto; padding: 32px 20px; }
          .card { background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); }
          .cta { display: inline-block; padding: 12px 20px; background: #2563eb; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
          .credentials { background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 20px 0; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <h2>Welcome to Ops-log!</h2>
            <p>You've been added as a <strong>${options.role}</strong> for <strong>${options.companyName}</strong>.</p>
            <p>Use the temporary credentials below to sign in and then update your password from the profile menu.</p>
            <div class="credentials">
              <div><strong>Email:</strong> ${options.to}</div>
              <div><strong>Temporary password:</strong> ${options.temporaryPassword}</div>
            </div>
            <p>If you didn't expect this email, please reach out to your Ops-log administrator.</p>
            <p style="margin-bottom: 0;">— The Ops-log Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private buildResetText(options: {
    to: string;
    temporaryPassword: string;
    companyName: string;
    role: 'admin' | 'user';
  }) {
    return [
      `Your Ops-log password was reset.`,
      ``,
      `Company: ${options.companyName}`,
      `Role: ${options.role}`,
      ``,
      `Use this temporary password to sign in, then update it from your profile settings:`,
      `Email: ${options.to}`,
      `Temporary password: ${options.temporaryPassword}`,
      ``,
      `If you did not request this change, contact your Ops-log administrator immediately.`,
    ].join('\n');
  }

  private buildResetHtml(options: {
    to: string;
    temporaryPassword: string;
    companyName: string;
    role: 'admin' | 'user';
  }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f9fafb; color: #111827; }
          .container { max-width: 640px; margin: 0 auto; padding: 32px 20px; }
          .card { background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); }
          .credentials { background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 20px 0; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <h2>Your Ops-log password was reset</h2>
            <p>You can now sign back in as <strong>${options.role}</strong> for <strong>${options.companyName}</strong>.</p>
            <p>Use the temporary credentials below, then change your password from the profile menu.</p>
            <div class="credentials">
              <div><strong>Email:</strong> ${options.to}</div>
              <div><strong>Temporary password:</strong> ${options.temporaryPassword}</div>
            </div>
            <p>If you didn't request this, notify your Ops-log administrator immediately.</p>
            <p style="margin-bottom: 0;">— The Ops-log Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private buildSignupWelcomeText(options: { to: string; companyName: string }) {
    return [
      `Welcome to Ops-log!`,
      ``,
      `Your account has been successfully created for ${options.companyName}.`,
      ``,
      `You can now sign in using:`,
      `Email: ${options.to}`,
      ``,
      `Start tracking your manufacturing operations with:`,
      `• Real-time machine operations monitoring`,
      `• Downtime event tracking`,
      `• Advanced analytics and KPIs`,
      `• Multi-shift support`,
      ``,
      `Your 14-day free trial has started. Explore all features without any limitations.`,
      ``,
      `If you have any questions or need assistance, feel free to reach out to our support team.`,
      ``,
      `Best regards,`,
      `The Ops-log Team`,
    ].join('\n');
  }

  private buildSignupWelcomeHtml(options: { to: string; companyName: string }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f9fafb; color: #111827; margin: 0; padding: 0; }
          .container { max-width: 640px; margin: 0 auto; padding: 32px 20px; }
          .card { background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); }
          .header { text-align: center; margin-bottom: 24px; }
          .header h1 { color: #2563eb; margin: 0 0 8px 0; font-size: 28px; }
          .welcome-box { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 24px; border-radius: 8px; margin: 24px 0; text-align: center; }
          .welcome-box h2 { margin: 0 0 8px 0; font-size: 24px; }
          .features { background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 24px 0; }
          .features ul { margin: 0; padding-left: 20px; }
          .features li { margin: 8px 0; line-height: 1.6; }
          .cta { text-align: center; margin: 24px 0; }
          .cta a { display: inline-block; padding: 14px 28px; background: #2563eb; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600; }
          .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>🎉 Welcome to Ops-log!</h1>
            </div>

            <div class="welcome-box">
              <h2>Your Account is Ready</h2>
              <p style="margin: 0; opacity: 0.95;">${options.companyName}</p>
            </div>

            <p>Congratulations! Your Ops-log account has been successfully created.</p>

            <p><strong>Login Email:</strong> ${options.to}</p>

            <div class="features">
              <h3 style="margin-top: 0; color: #111827;">What you can do with Ops-log:</h3>
              <ul>
                <li><strong>Real-time Monitoring</strong> - Track machine operations and downtime events as they happen</li>
                <li><strong>Advanced Analytics</strong> - 6 interactive charts to visualize your production data</li>
                <li><strong>KPI Dashboards</strong> - Monitor critical metrics like MTTR and equipment availability</li>
                <li><strong>Multi-shift Support</strong> - Manage operations across different shifts seamlessly</li>
                <li><strong>Complete Administration</strong> - Manage lines, machines, and operators from one interface</li>
              </ul>
            </div>

            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 4px;">
              <p style="margin: 0;"><strong>🚀 Your 14-day free trial has started!</strong></p>
              <p style="margin: 8px 0 0 0; font-size: 14px;">Explore all features without any limitations. No credit card required.</p>
            </div>

            <div class="cta">
              <a href="${this.configService.get<string>('APP_URL') || 'https://ops-log.com'}/login" style="color: #fff;">Sign In Now</a>
            </div>

            <p>If you have any questions or need assistance getting started, our support team is here to help.</p>

            <p style="margin-bottom: 0;">Best regards,<br><strong>The Ops-log Team</strong></p>

            <div class="footer">
              <p>This email was sent because you created an account on Ops-log.</p>
              <p>If you didn't create this account, please contact us immediately.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private buildSignupNotificationText(options: {
    userEmail: string;
    companyName: string;
    fullName?: string;
  }) {
    const timestamp = new Date().toLocaleString('fr-FR', {
      timeZone: 'Europe/Paris',
      dateStyle: 'full',
      timeStyle: 'long',
    });

    return [
      `New Ops-log Free Trial Account Created!`,
      ``,
      `A new user has signed up for a free trial account.`,
      ``,
      `Client Details:`,
      `${options.fullName ? `Name: ${options.fullName}` : ''}`,
      `Email: ${options.userEmail}`,
      `Company: ${options.companyName}`,
      ``,
      `Signup Date: ${timestamp}`,
      `Account Type: Free Trial (14 days)`,
      ``,
      `This account was created via the landing page signup form.`,
    ]
      .filter((line) => line !== '')
      .join('\n');
  }

  private buildSignupNotificationHtml(options: {
    userEmail: string;
    companyName: string;
    fullName?: string;
  }) {
    const timestamp = new Date().toLocaleString('fr-FR', {
      timeZone: 'Europe/Paris',
      dateStyle: 'full',
      timeStyle: 'long',
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f9fafb; color: #111827; margin: 0; padding: 0; }
          .container { max-width: 640px; margin: 0 auto; padding: 32px 20px; }
          .card { background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 24px; border-radius: 8px 8px 0 0; margin: -32px -32px 24px -32px; }
          .header h1 { margin: 0; font-size: 24px; }
          .info-box { background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .info-row { padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
          .info-row:last-child { border-bottom: none; }
          .label { font-weight: 600; color: #374151; display: inline-block; min-width: 120px; }
          .value { color: #111827; }
          .badge { display: inline-block; padding: 4px 12px; background: #fef3c7; color: #92400e; border-radius: 12px; font-size: 14px; font-weight: 600; }
          .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>🎉 New Free Trial Signup</h1>
            </div>

            <p>A new user has just created a free trial account on Ops-log.</p>

            <div class="info-box">
              <h3 style="margin-top: 0; color: #111827;">Client Details</h3>
              ${options.fullName ? `<div class="info-row"><span class="label">Name:</span> <span class="value">${options.fullName}</span></div>` : ''}
              <div class="info-row">
                <span class="label">Email:</span>
                <span class="value"><a href="mailto:${options.userEmail}">${options.userEmail}</a></span>
              </div>
              <div class="info-row">
                <span class="label">Company:</span>
                <span class="value"><strong>${options.companyName}</strong></span>
              </div>
              <div class="info-row">
                <span class="label">Signup Date:</span>
                <span class="value">${timestamp}</span>
              </div>
              <div class="info-row">
                <span class="label">Account Type:</span>
                <span class="badge">Free Trial - 14 Days</span>
              </div>
            </div>

            <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 16px; margin: 24px 0; border-radius: 4px;">
              <p style="margin: 0; color: #1e40af;"><strong>ℹ️ Note:</strong> This account was created via the landing page signup form.</p>
            </div>

            <div class="footer">
              <p>This is an automated notification from Ops-log</p>
              <p>ITECS - Industrial Tech Solutions</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
