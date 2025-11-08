import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './company.schema';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
  ) {}

  async getCompany(companyId: string) {
    try {
      // Find by companyId field, not _id
      const company = await this.companyModel.findOne({ _id: companyId });
      if (!company) throw new NotFoundException('Company not found');
      return company.toObject(); // Ensure all fields are returned
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed to get company',
        error:
          error && typeof error === 'object' && 'message' in error
            ? (error as { message: string }).message
            : String(error),
      });
    }
  }

  async updateCompany(data: Partial<Company>, companyId: string) {
    try {
      if (!data.companyName)
        throw new BadRequestException('companyName is required');
      // Validate reportEmails if present
      if (data.reportEmails) {
        const emails = data.reportEmails.split(',').map((e) => e.trim());
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const invalidEmails = emails.filter((email) => !emailRegex.test(email));
        if (invalidEmails.length > 0) {
          throw new BadRequestException(
            `Invalid reportEmails: ${invalidEmails.join(', ')}`,
          );
        }
        data.reportEmails = emails.join(','); // Ensure trimmed and valid format
      }

      // Allow updating companyLogoUrl
      if (data.companyLogoUrl && typeof data.companyLogoUrl !== 'string') {
        throw new BadRequestException('companyLogoUrl must be a string');
      }
      // Validate shiftTimings if present
      if (data.shiftTimings) {
        if (!Array.isArray(data.shiftTimings)) {
          throw new BadRequestException('shiftTimings must be an array');
        }
        if (data.shiftTimings.length > 3) {
          throw new BadRequestException('A maximum of 3 shifts is allowed');
        }
        const time24 = /^([01]\d|2[0-3]):([0-5]\d)$/;
        for (const shift of data.shiftTimings) {
          if (!shift.name || typeof shift.name !== 'string') {
            throw new BadRequestException('Each shift must have a name');
          }
          if (!shift.start || !time24.test(shift.start)) {
            throw new BadRequestException(
              `Invalid start time for shift ${shift.name} (must be HH:mm 24-hour)`,
            );
          }
          if (!shift.end || !time24.test(shift.end)) {
            throw new BadRequestException(
              `Invalid end time for shift ${shift.name} (must be HH:mm 24-hour)`,
            );
          }
          // Calculate duration in hours
          const [sh, sm] = shift.start.split(':').map(Number);
          const [eh, em] = shift.end.split(':').map(Number);
          let duration = eh * 60 + em - (sh * 60 + sm);
          if (duration <= 0) duration += 24 * 60; // overnight shift
          if (duration > 8 * 60) {
            throw new BadRequestException(
              `Shift ${shift.name} exceeds 8 hours`,
            );
          }
        }
        // Check for overlapping shifts
        const intervals = data.shiftTimings.map((s) => {
          const [sh, sm] = s.start.split(':').map(Number);
          const [eh, em] = s.end.split(':').map(Number);
          const start = sh * 60 + sm;
          let end = eh * 60 + em;
          if (end <= start) end += 24 * 60;
          return { name: s.name, start, end };
        });
        for (let i = 0; i < intervals.length; i++) {
          for (let j = i + 1; j < intervals.length; j++) {
            if (
              (intervals[i].start < intervals[j].end &&
                intervals[i].end > intervals[j].start) ||
              (intervals[j].start < intervals[i].end &&
                intervals[j].end > intervals[i].start)
            ) {
              throw new BadRequestException(
                `Shifts ${intervals[i].name} and ${intervals[j].name} overlap`,
              );
            }
          }
        }
      }
      const updated = await this.companyModel.findOneAndUpdate(
        { _id: companyId },
        { ...data },
        {
          new: true,
          upsert: true,
        },
      );
      if (!updated) throw new NotFoundException('Company not found');
      return updated;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed to update company',
        error:
          error && typeof error === 'object' && 'message' in error
            ? (error as { message: string }).message
            : String(error),
      });
    }
  }
}
