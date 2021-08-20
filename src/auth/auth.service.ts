import {
  Injectable,
  UnprocessableEntityException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CredentialsDto } from './dto/credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/users/user-roles.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<Users> {
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 8);
    return await this.userRepository.save(createUserDto);
  }

  async signIn(credentialsDto: CredentialsDto) {
    const user = await this.userRepository.findOne({ 
      where :{
        email: credentialsDto.email
      }  
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordIsValid = bcrypt.compareSync(
      credentialsDto.password,
      user.password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credenciais inválidas');
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
