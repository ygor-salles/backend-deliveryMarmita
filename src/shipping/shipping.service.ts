import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Shipping } from './entities/shipping.entity';
import { ShippingDto } from './dto/shipping.dto';

@Injectable()
export class ShippingService{
  constructor(
    @InjectRepository(Shipping)
    private readonly shippingRepository: Repository<Shipping>,
  ) {}

  public async findAll() {
    const shippings = await this.shippingRepository.find();
    return shippings;
  }

  public async findById(shippingId: string): Promise<Shipping> {
    const shipping = await this.shippingRepository.findOne({
      where: {
        id: shippingId,
      },
    });

    if (!shipping) {
      throw new NotFoundException(`Frete #${shippingId} não encontrado`);
    }

    return shipping;
  }

  public async create(shippingDto: ShippingDto): Promise<Shipping> {
    try {
      return await this.shippingRepository.save(shippingDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: string, shippingDto: ShippingDto): Promise<Shipping> {
    try {
      const shipping = await this.shippingRepository.findOne({id: +id});
      shipping.neighborhood = shippingDto.neighborhood;
      shipping.value = shippingDto.value;
      
      return await this.shippingRepository.save(shipping);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async delete(id: string): Promise<any> {
    try {
      return await this.shippingRepository.delete(+id);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

}
