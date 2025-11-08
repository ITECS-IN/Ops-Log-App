import { IsOptional, IsString, Matches } from 'class-validator';

export class CreateOperatorDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  employeeCode?: string;

  @IsString()
  shift: string; // "A", "B", or "C"

  @IsOptional()
  @IsString()
  role?: string;

  @IsString()
  @Matches(/^[0-9]{4,6}$/, { message: 'PinCode must be 4–6 digits' })
  pinCode: string;
}
