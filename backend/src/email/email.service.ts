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
}
