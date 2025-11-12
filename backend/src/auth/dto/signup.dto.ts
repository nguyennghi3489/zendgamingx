import { IsEmail, IsNotEmptyObject } from 'class-validator';

export class SignUpDto {
  @IsNotEmptyObject()
  name: string;

  @IsEmail()
  email: string;
}
