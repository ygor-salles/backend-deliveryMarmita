import { MaxLength, IsNotEmpty, IsEmail, ValidateIf, IsEnum } from 'class-validator';
import { UserRole } from '../user-roles.enum';

export class UserProfileDto {
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

  @ValidateIf(o => 'role' in o)
  @IsNotEmpty({
    message: 'Informe um perfil',
  })
  @IsEnum(UserRole)
  role: string;
}
