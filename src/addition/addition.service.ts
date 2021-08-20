import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Addition } from './entities/addition.entity';
import { AdditionDto } from './dto/addition.dto';

@Injectable()
export class AdditionService{
  constructor(
    @InjectRepository(Addition)
    private readonly additionRepository: Repository<Addition>,
  ) {}

  public async findAll(query: any) {
    let where = { status: null };

    if(query.status != undefined) where.status = query.status;
    else where = null;

    const additions = await this.additionRepository.find(where);
    return additions;
  }

  public async findById(additionId: string): Promise<Addition> {
    const addition = await this.additionRepository.findOne({
      where: {
        id: additionId,
      },
    });

    if (!addition) {
      throw new NotFoundException(`Acréscimo #${additionId} não encontrado`);
    }

    return addition;
  }

  public async create(additionDto: AdditionDto): Promise<Addition> {
    try {
      return await this.additionRepository.save(additionDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: string, additionDto: AdditionDto): Promise<Addition> {
    try {
      const addition = await this.additionRepository.findOne({id: +id});
      addition.name = additionDto.name;
      addition.price = additionDto.price;
      
      return await this.additionRepository.save(addition);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateStatus(body: any, id: string): Promise<Addition> {
    try {
      return await this.additionRepository.save({ ...body, id: Number(id) });
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async delete(id: string): Promise<any> {
    try {
      return await this.additionRepository.delete(+id);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

}
