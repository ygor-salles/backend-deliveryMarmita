import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/entities/users.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import * as path from 'path';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private readonly mailerService: MailerService,
  ) { }

  public async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto
  ): Promise<any> {
    const userUpdate = await this.userRepository.findOne({
      email: forgotPasswordDto.email,
    });
    const passwordRand = Math.random()
      .toString(36)
      .slice(-8);
    userUpdate.password = bcrypt.hashSync(passwordRand, 8);

    this.sendMailForgotPassword(userUpdate.email, passwordRand);
    return await this.userRepository.save(userUpdate);

  }

  private sendMailForgotPassword(email, password) {
    this.mailerService
      .sendMail({
        to: email,
        from: 'fuser263@gmail.com',
        subject: 'Reset de senha ✔',
        text: 'Reset de senha!',
        template: path.resolve(__dirname, '..', '..', 'templates', 'emails', 'index'),
        context: {
          display: 'block',
          host: process.env.NODE_ENV === 'development' ?
            `${process.env.FRONTEND_DEV}/#/recuperar-senha`
            : `${process.env.FRONTEND_PROD}/#/recuperar-senha`,
          title: 'Reset de senha!',
          description:
            'Senha alterada com sucesso! Seu código de verificação é: ' +
            password + ', caso queira atualizar sua senha clique no botão abaixo.'
        },
      })
      .then(async response => {
        console.log('Forgot Password: Send Mail successfully!');
      })
      .catch(err => {
        console.log('Forgot Password: Send Mail Failed!');
      });
  }
}
