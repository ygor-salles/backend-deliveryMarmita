import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as path from 'path';

@Injectable()
export class ChangePasswordService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) { }

  public async changePassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<any> {
    const alteracaoSenha = await this.usersService.updateByPassword(
      changePasswordDto.email,
      changePasswordDto.password,
      changePasswordDto.codVerificacao
    );
    if (alteracaoSenha) {
      this.sendMailChangePassword(changePasswordDto);
    }
    return alteracaoSenha;
  }

  private sendMailChangePassword(user): void {
    this.mailerService
      .sendMail({
        to: user.email,
        from: 'fuser263@gmail.com',
        subject: 'Alteração de senha ✔',
        text: 'Alteração de senha!',
        template: path.resolve(__dirname, '..', '..', 'templates', 'emails', 'index'),
        context: {
          display: 'none',
          host: '#',
          title: 'Senha alterada com sucesso!',
          description:
            'Senha alterada com sucesso!',
          nameUser: user.name,
        },
      })
      .then(response => {
        console.log('Change Password: Send Mail successfully!');
      })
      .catch(err => {
        console.log('Change Password: Send Mail Failed!');
      });
  }
}
