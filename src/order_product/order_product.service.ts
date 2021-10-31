import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderProduct } from './entities/order_product.entity';

interface IReports {
  value: number;
  name: string;
}

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
  ) { }

  public async createOrderProduct(order_id: number, body: any): Promise<any> {
    try {
      const list = [];

      body.forEach(element => {
        list.push({
          amount: element.amount,
          observation: element.observation != undefined ? element.observation : null,
          meet_options: element.meet_options != undefined ? element.meet_options : null,
          total_item: element.total_item,
          order_id: order_id,
          product_id: element.product
        });
      });

      return await this.orderProductRepository.save(list);

    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async deleteProductFromOrder(order_id: number): Promise<any> {
    try {
      return await this.orderProductRepository.delete({
        order_id: order_id
      });

    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async bestSellers(): Promise<any> {
    try {
      const productsDay: IReports[] = await this.orderProductRepository.query(`
      SELECT SUM(op.total_item) AS value, p.name 
      FROM order_product op 
      INNER JOIN products p
      ON op.product_id = p.id
      INNER JOIN orders o
      ON o.id = op.order_id
      WHERE op.created_at >= NOW() - INTERVAL '1 DAY' AND o.status = 'entregue'
      GROUP BY p.id,p.name
      ORDER BY p.name    
    `)
      let totalDay = 0;
      if (productsDay.length > 0) {
        totalDay = productsDay.map(products => products.value).reduce((sum, current) => {
          return sum + current;
        });
      }

      const productsWeek: IReports[] = await this.orderProductRepository.query(`
      SELECT SUM(op.total_item) AS value, p.name 
      FROM order_product op 
      INNER JOIN products p
      ON op.product_id = p.id
      INNER JOIN orders o
      ON o.id = op.order_id
      WHERE op.created_at >= NOW() - INTERVAL '7 DAY' AND o.status = 'entregue'
      GROUP BY p.id,p.name
      ORDER BY p.name
    `);
      let totalWeek = 0;
      if (productsWeek.length > 0) {
        totalWeek = productsWeek.map(products => products.value).reduce((sum, current) => {
          return sum + current;
        });
      }

      const productsMonth: IReports[] = await this.orderProductRepository.query(`
      SELECT SUM(op.total_item) AS value, p.name 
      FROM order_product op 
      INNER JOIN products p
      ON op.product_id = p.id
      INNER JOIN orders o
      ON o.id = op.order_id
      WHERE op.created_at >= NOW() - INTERVAL '30 DAY' AND o.status = 'entregue'
      GROUP BY p.id,p.name
      ORDER BY p.name
    `);
      let totalMonth = 0
      if (productsMonth.length > 0) {
        totalMonth = productsMonth.map(products => products.value).reduce((sum, current) => {
          return sum + current;
        });
      }

      return {
        arrayDay: productsDay,
        totalDay: totalDay,
        arrayWeek: productsWeek,
        totalWeek: totalWeek,
        arrayMonth: productsMonth,
        totalMonth: totalMonth,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

}
