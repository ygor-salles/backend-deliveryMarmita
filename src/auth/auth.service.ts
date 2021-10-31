import {
  Injectable, UnauthorizedException, BadRequestException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Users } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { CredentialsDto } from './dto/credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private jwtService: JwtService,
  ) { }

  async signUp(createUserDto: CreateUserDto): Promise<Users> {
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 8);
    return await this.userRepository.save(createUserDto);
  }

  async signIn(credentialsDto: CredentialsDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: credentialsDto.email
      }
    });

    if (!user) {
      throw new BadRequestException('Credenciais inválidas');
    }

    const passwordIsValid = bcrypt.compareSync(
      credentialsDto.password,
      user.password,
    );

    if (!passwordIsValid) {
      throw new BadRequestException('Credenciais inválidas');
    }

    const jwtPayload = {
      id: user.id,
      username: user.username,
      role: user.role
    };
    const token = this.jwtService.sign(jwtPayload);

    delete user.password;
    return { "token": token };
  }

}
