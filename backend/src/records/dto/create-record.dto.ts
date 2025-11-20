import {
  IsString,
  IsOptional,
  IsNumber,
  IsMongoId,
  IsIn,
  IsInt,
  Min,
  Max,
  IsDefined,
} from 'class-validator';

export class CreateRecordDto {
  @IsDefined()
  @IsString()
  userId: string;

  @IsDefined()
  @IsMongoId()
  lineId: string;

  @IsDefined()
  @IsMongoId()
  machineId: string;

  @IsString()
  @IsIn(['A', 'B', 'C'])
  shift: string;

  @IsString()
  @IsIn(['Observation', 'Breakdown', 'Setup', 'Quality'])
  noteType: string;

  @IsInt()
  @Min(1)
  @Max(5)
  severity: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string; // for image or video

  @IsOptional()
  @IsString()
  downtimeStart?: string;

  @IsOptional()
  @IsString()
  downtimeEnd?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsString()
  @IsIn(['Open', 'Closed'])
  status?: string;
}
