import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createTransport,
  type SendMailOptions,
  type Transporter,
} from 'nodemailer';
import type { Lead } from '../leads/schemas/lead.schema';

type LeadWithTimestamps = Lead & { createdAt?: Date | string };

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter?: Transporter;
  private readonly fromAddress?: string;
  private readonly notificationsRecipient: string;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('EMAIL_HOST');
    const port = Number(this.configService.get<string>('EMAIL_PORT') ?? 587);
    const user = this.configService.get<string>('EMAIL_USER');
    const pass = this.configService.get<string>('EMAIL_PASS');
    this.fromAddress = this.configService.get<string>('EMAIL_FROM');
    this.notificationsRecipient =
      this.configService.get<string>('LEAD_NOTIFICATION_TO') ??
      'itechlicense@outlook.com';

    if (host && user && pass && this.fromAddress) {
      this.transporter = createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    } else {
      this.logger.warn(
        'Email transport is not configured. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, and EMAIL_FROM to enable notifications.',
      );
    }
  }

  async sendLeadNotification(lead: Lead) {
    await this.send({
      to: this.notificationsRecipient,
      subject: `New Ops-log lead: ${lead.fullName}`,
      text: this.buildLeadText(lead),
      html: this.buildLeadHtml(lead),
    });
  }

  private async send(options: Omit<SendMailOptions, 'from'>) {
    if (!this.transporter || !this.fromAddress) {
      this.logger.warn(
        'Attempted to send mail but email transport is disabled.',
      );
      return;
    }

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        ...options,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
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
      <p>A new lead was captured from the Ops-log landing page.</p>
      <ul>
        <li><strong>Name:</strong> ${lead.fullName}</li>
        <li><strong>Email:</strong> ${lead.email}</li>
        <li><strong>Company:</strong> ${lead.company ?? 'N/A'}</li>
        <li><strong>Phone:</strong> ${lead.phone ?? 'N/A'}</li>
        <li><strong>Source:</strong> ${lead.source ?? 'landing-page'}</li>
        <li><strong>CTA:</strong> ${lead.cta ?? 'N/A'}</li>
        <li><strong>Submitted:</strong> ${submitted}</li>
      </ul>
      <p><strong>Notes:</strong></p>
      <p>${lead.notes ?? 'N/A'}</p>
    `;
  }

  private resolveSubmittedAt(lead: Lead) {
    const createdAt = (lead as LeadWithTimestamps).createdAt;
    if (!createdAt) {
      return new Date();
    }
    return createdAt instanceof Date ? createdAt : new Date(createdAt);
  }
}
