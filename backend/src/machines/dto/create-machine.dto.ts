import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateMachineDto {
  @IsMongoId()
  lineId: string;

  @IsString()
  machineName: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
