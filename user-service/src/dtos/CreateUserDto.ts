import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength
} from "class-validator";

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}