import { Injectable, NotFoundException, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { IUsers } from './interfaces/users.interface';
import * as bcrypt from 'bcrypt';
import { UserProfileDto } from './dto/user-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) { }

  public async findByEmail(email: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuário ${email} não encontrado`);
    }

    return user;
  }

  public async findAll() {
    const users = await this.userRepository.find({
      select: ["id", "name", "username", "email", "role", "created_at"]
    });
    return users;
  }

  public async findById(userId: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuário #${userId} não encontrado`);
    }

    delete user.password;
    delete user.name;
    delete user.email;
    delete user.created_at;
    delete user.updated_at;
    return user;
  }

  public async create(createUserDto: CreateUserDto): Promise<IUsers> {
    try {
      createUserDto.password = bcrypt.hashSync(createUserDto.password, 8);
      return await this.userRepository.save(createUserDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateByEmail(email: string): Promise<Users> {
    try {
      const user = await this.userRepository.findOne({ email: email });
      user.password = bcrypt.hashSync(
        Math.random()
          .toString(36)
          .slice(-8),
        8,
      );

      return await this.userRepository.save(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateByPassword(
    email: string,
    password: string,
    codVerificao: string
  ): Promise<Users> {
    try {
      const user = await this.userRepository.findOne({ email: email });
      if (!user) {
        throw new UnauthorizedException('E-mail inexistente');
      }

      const passwordIsValid = bcrypt.compareSync(
        codVerificao,
        user.password,
      );

      if (!passwordIsValid) {
        throw new UnauthorizedException('Código de verificação incorreto');
      }

      user.password = bcrypt.hashSync(password, 8);

      return await this.userRepository.save(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }

  }

  public async updateProfileUser(id: string, userProfileDto: UserProfileDto): Promise<Users> {
    try {
      const user = await this.userRepository.findOne({ id: +id });
      user.name = userProfileDto.name;
      user.email = userProfileDto.email;
      user.username = userProfileDto.username;
      if (userProfileDto.role) {
        user.role = userProfileDto.role;
      }

      return await this.userRepository.save(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async deleteUser(id: string): Promise<any> {
    try {
      return await this.userRepository.delete(+id);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

}
