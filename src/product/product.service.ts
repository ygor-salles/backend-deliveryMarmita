import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
import { Repository } from 'typeorm';
import { ProductDto } from './dto/product.dto';

interface IProductPaged {
  total: number; 
  page: number;
  totalPages: number;
  limit: number; 
  offset: number;
  instaces: Products[];
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>
  ) {}

  public async create(productDto: ProductDto): Promise<Products> {
    try {
      return await this.productRepository.save(productDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async update(productDto: ProductDto, id: string): Promise<Products> {
    try {
      return await this.productRepository.save({ ...productDto, id: Number(id) });
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateStatus(body: any, id: string): Promise<Products> {
    try {
      return await this.productRepository.save({ ...body, id: Number(id) });
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async findAll(query: any): Promise<Products[]> {

    const objectWhere = {
      status: null,
      type: null,
      size: null
    };

    if(query.status != undefined){
      objectWhere.status = query.status;
    }
    if(query.type != undefined){
      objectWhere.type = query.type;
    }
    if(query.size != undefined){
      objectWhere.size = query.size;
    }

    let where = {};
    where = Object.keys(objectWhere).filter((k) => objectWhere[k] != null)
              .reduce((a, k) => ({ ...a, [k]: objectWhere[k] }), {});

    const products = await this.productRepository.find(where);
    return products;
  }

  public async findById(id: string): Promise<Products> {
    const product = await this.productRepository.findOne({
      where: {
        id: id
      }
    });
    return product;
  }

  public async findActive(ids: any): Promise<any> {
    const products = await this.productRepository.findByIds(ids);
    return products;
  }

  public async delete(id: string): Promise<any> {
    try {
      const product = await this.productRepository.findOne({
        where: {
          id: id
        }
      });

      if(!product){
        throw new NotFoundException(`Produto #${id} não encontrado`);
      }

      return await this.productRepository.softRemove(product);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async findPaged(limit: number, page: number, type: string): Promise<IProductPaged> {
    const ITENS_PER_PAGE = 100;
    limit = limit > ITENS_PER_PAGE || limit <= 0 ? ITENS_PER_PAGE : limit;
    const offset = page <= 0 ? 0 : page * limit;

    const productsPaged = await this.productRepository.find({
      where: { type },
      order: { createdAt: 'ASC' },
      skip: offset,
      take: limit,
    });

    const total = await this.productRepository.count({where: {type}});
    const totalPages = total > limit ? total / limit : 1;
    return { total, page, totalPages, limit, offset, instaces: productsPaged }
  }

  public async findBySize(): Promise<any> {
    const products = await this.productRepository.query(`
      select sum(products.price)/count(products.size) as price, products.size 
      from products 
      where products.size is not null 
      group by products.size
    `)

    return products;

  }

}
