import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../user-roles.enum';

export class CreateUserDto {
  @IsNotEmpty({
    message: 'Informe um endereço de email',
  })
  @IsEmail(
    {},
    {
      message: 'Informe um endereço de email válido',
    },
  )
  @MaxLength(200, {
    message: 'O endereço de email deve ter menos de 200 caracteres',
  })
  email: string;

  @IsNotEmpty({
    message: 'Informe o nome do usuário',
  })
  @MaxLength(200, {
    message: 'O nome deve ter menos de 200 caracteres',
  })
  name: string;

  @IsNotEmpty({
    message: 'Informe o apelido do usuário',
  })
  @MaxLength(20, {
    message: 'O apelido deve ter menos de 20 caracteres',
  })
  username: string;

  @IsNotEmpty({
    message: 'Informe uma senha',
  })
  @MinLength(6, {
    message: 'A senha deve ter no mínimo 6 caracteres',
  })
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message:
  //     'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número ou um símbulo',
  // })
  password: string;

  @IsNotEmpty({
    message: 'Informe um perfil',
  })
  @IsEnum(UserRole)
  role: string;
}
