import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsMobilePhone } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsMobilePhone()
  mobileNumber: string;

  @ApiProperty()
  @MinLength(6)
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  profilePicUrl?: string;
}
