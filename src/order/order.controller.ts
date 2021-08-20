import { Body, Controller, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { Role } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { OrderProductService } from 'src/order_product/order_product.service';
import { ProductService } from 'src/product/product.service';
import { UserRole } from 'src/users/user-roles.enum';
import { Transaction } from 'typeorm';
import { OrderDto } from './dto/order.dto';
import { Orders } from './entities/orders.entity';
import { OrderStatus } from './order-status.enum';
import { OrderService } from './order.service';

@Controller('api/orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderProductService: OrderProductService,
    private readonly productService: ProductService
    ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async getAll(@Res() res, @Req() request): Promise<Orders[]> {
    const orders = await this.orderService.findAll(request.query);

    return res.status(HttpStatus.OK).json(orders);
  }

  @Get('/paged')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async getPaged(@Res() res: Response, @Req() request: Request) {
    const orderPaged = await this.orderService.findPaged(request.query); 
    
    return res.status(HttpStatus.OK).json({
      total: orderPaged.total,
      page: orderPaged.page,
      totalPages: orderPaged.totalPages,
      limit: orderPaged.limit,
      offset: orderPaged.offset,
      instances: orderPaged.instaces
    });
  }

  @Get('/historic/paged')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async getHistoricPaged(@Res() res: Response, @Req() request: Request) {
    const orderPaged = await this.orderService.findHistoricPaged(request.query); 
    
    return res.status(HttpStatus.OK).json({
      total: orderPaged.total,
      page: orderPaged.page,
      totalPages: orderPaged.totalPages,
      limit: orderPaged.limit,
      offset: orderPaged.offset,
      instances: orderPaged.instaces
    });
  }

  @Get('/count')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async getCount(@Res() res: Response): Promise<any> {
    const countOrders = await this.orderService.findCount();
    return res.status(HttpStatus.OK).json(countOrders[0]);
  }

  @Get('/:orderId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async getById(@Res() res, @Param('orderId') orderId: string): Promise<Orders> {
    const order = await this.orderService.findById(orderId);

    return res.status(HttpStatus.OK).json(order);
  } 

  @Post()
  public async create(
    @Res() res,
    @Body() orderDto: OrderDto,
  ): Promise<any> {
    try {
      const products = [];
      orderDto.products.forEach(element => {
        products.push(element.product);
      });

      const productsActive = await this.productService.findActive(products);
      if (productsActive.some(e => !e.status)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Alguns produtos estão indisponíveis no momento.',
          status: HttpStatus.BAD_REQUEST,
        });
      }

      const order = await this.orderService.create(orderDto);
      this.orderProductService.createOrderProduct(order.id, orderDto.products);

      return res.status(HttpStatus.OK).json({
        message: 'Pedido cadastrado com sucesso.',
        status: HttpStatus.OK,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Erro ao cadastrar pedido!' + err,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Put(':orderId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async updateOrder(
    @Res() res,
    @Body() orderDto: OrderDto,
    @Param('orderId') orderId: string
  ): Promise<any> {
    try {
      let order = await this.orderService.findById(orderId);
      if(order){
        order = await this.orderService.update(orderDto, orderId);
        await this.orderProductService.deleteProductFromOrder(order.id);
        await this.orderProductService.createOrderProduct(order.id, orderDto.products);

        return res.status(HttpStatus.OK).json({
          message: 'Pedido atualizado com sucesso.',
          status: HttpStatus.OK,
        });
      }
      else{
        return res.status(HttpStatus.OK).json({
          message: 'Pedido não encontrado.',
          status: HttpStatus.NOT_FOUND,
        });
      }
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Erro ao atualizar pedido!' + err,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Put('/:orderId/changeStatus')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async update(
    @Res() res,
    @Body() orderStatus: any,
    @Param('orderId') orderId: string
  ): Promise<any> {
    try {
      const order = await this.orderService.findById(orderId);
      if(order){
        order.status = orderStatus.status;
        await this.orderService.updateStatus(order, orderId);
  
        return res.status(HttpStatus.OK).json({
          message: 'Status atualizado com sucesso.',
          status: HttpStatus.OK,
        });
      }
      else{
        return res.status(HttpStatus.OK).json({
          message: 'Pedido não encontrado.',
          status: HttpStatus.NOT_FOUND,
        });
      }
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Erro ao atualizar status!',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Get('/bestSellers/dashboard')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public async bestSellers(@Res() res): Promise<any> {
    const reports = await this.orderProductService.bestSellers();

    return res.status(HttpStatus.OK).json(reports);
  }

}
