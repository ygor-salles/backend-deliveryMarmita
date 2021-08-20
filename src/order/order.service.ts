import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from './entities/orders.entity';
import { Between, In, Repository } from 'typeorm';
import { OrderDto } from './dto/order.dto';
import { OrderStatus } from './order-status.enum';

interface IOrderPaged {
  total: number; 
  page: number;
  totalPages: number;
  limit: number; 
  offset: number;
  instaces: Orders[];
}

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Orders)
    private readonly orderRepository: Repository<Orders>,
  ) {}

  public async create(orderDto: OrderDto): Promise<Orders> {
    try {
      return await this.orderRepository.save(orderDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async findAll(query: any): Promise<any> {
    const objectWhere = {
      status: null,
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_name: null,
      createdAt: null
    };
    if(query.status != undefined){
      objectWhere.status = query.status;
    }
    if(query.client != undefined){
      // eslint-disable-next-line @typescript-eslint/camelcase
      objectWhere.client_name = query.client;

    }
    if(query.data != undefined){
      // objectWhere.createdAt = LessThan(query.data + ' 23:59:59')
      objectWhere.createdAt = Between(query.data + ' 00:00:00', query.data + ' 23:59:59');
    }

    let where = {};
    where = Object.keys(objectWhere).filter((k) => objectWhere[k] != null)
              .reduce((a, k) => ({ ...a, [k]: objectWhere[k] }), {});

    const orders = await this.orderRepository.find({where, relations: ["orderToProducts"]});
    return orders;
  }

  public async findPaged(query: any): Promise<IOrderPaged> {
    let { limit, page }: any = query;
    // console.log(query);
    limit = parseInt(limit || 0);
    page = parseInt(page || 0);

    const ITENS_PER_PAGE = 100;
    limit = limit > ITENS_PER_PAGE || limit <= 0 ? ITENS_PER_PAGE : limit;
    const offset = page <= 0 ? 0 : page * limit;

    const objectWhere = {
      status: In([OrderStatus.ANDAMENTO, OrderStatus.INICIALIZADO, OrderStatus.PRONTO]),
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_name: null,
      createdAt: null
    };
    if(query.status != undefined){
      objectWhere.status = query.status;
    }
    if(query.client != undefined){
      // eslint-disable-next-line @typescript-eslint/camelcase
      objectWhere.client_name = query.client;

    }
    if(query.data != undefined){
      objectWhere.createdAt = Between(query.data + ' 00:00:00', query.data + ' 23:59:59');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let where = {};
    where = Object.keys(objectWhere).filter((k) => objectWhere[k] != null)
              .reduce((a, k) => ({ ...a, [k]: objectWhere[k] }), {});

    const ordersPaged = await this.orderRepository.find({
      order: { createdAt: 'ASC' },
      skip: offset,
      take: limit,
      where
    });

    const total = await this.orderRepository.count({where});
    const totalPages = total > limit ? total / limit : 1;
    return { total, page, totalPages, limit, offset, instaces: ordersPaged }
  }

  public async findHistoricPaged(query: any): Promise<IOrderPaged> {
    let { limit, page }: any = query;
    // console.log(query);
    limit = parseInt(limit || 0);
    page = parseInt(page || 0);

    const ITENS_PER_PAGE = 100;
    limit = limit > ITENS_PER_PAGE || limit <= 0 ? ITENS_PER_PAGE : limit;
    const offset = page <= 0 ? 0 : page * limit;

    const objectWhere = {
      status: In([OrderStatus.CANCELADO, OrderStatus.ENTREGUE]),
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_name: null,
      createdAt: null
    };
    if(query.status != undefined){
      objectWhere.status = query.status;
    }
    if(query.client != undefined){
      // eslint-disable-next-line @typescript-eslint/camelcase
      objectWhere.client_name = query.client;

    }
    if(query.data != undefined){
      objectWhere.createdAt = Between(query.data + ' 00:00:00', query.data + ' 23:59:59');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let where = {};
    where = Object.keys(objectWhere).filter((k) => objectWhere[k] != null)
              .reduce((a, k) => ({ ...a, [k]: objectWhere[k] }), {});

    const ordersPaged = await this.orderRepository.find({
      order: { createdAt: 'ASC' },
      skip: offset,
      take: limit,
      where
    });

    const total = await this.orderRepository.count({where});
    const totalPages = total > limit ? total / limit : 1;
    return { total, page, totalPages, limit, offset, instaces: ordersPaged }
  }

  public async updateStatus(order: Orders, id: string): Promise<Orders> {
    try {
      return await this.orderRepository.save({ ...order, id: Number(id) });
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async findById(id: string): Promise<Orders> {
    const order = await this.orderRepository.findOne({
      where: {
        id: id
      },
      relations: ["orderToProducts"]
    });
    return order;
  }

  public async update(orderDto: OrderDto, id: string): Promise<Orders> {
    try {
      return await this.orderRepository.save({ ...orderDto, id: Number(id) });
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async findCount(): Promise<any> {
    return await this.orderRepository.query(`
      select count(id) as qtd
      from orders
      where status = 'entregue' AND createdAt >= NOW() - INTERVAL 1 DAY
    `);
  }

}