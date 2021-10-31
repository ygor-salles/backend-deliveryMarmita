import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Orders } from './entities/orders.entity';
import { OrderStatus } from './order-status.enum';
import { Products } from 'src/product/entities/products.entity';
import { ProductType } from 'src/product/product-type.enum';
import { ProductSize } from 'src/product/product-size.enum';
import { OrderProductService } from 'src/order_product/order_product.service';
import { ProductService } from 'src/product/product.service';

const ordersList: Orders[] = [
  new Orders(
    {
      id: 1,
      client_name: "paulo",
      phone: "999999999",
      cep: "375000-000",
      address_street: "rua",
      address_number: 1,
      address_neighborhood: "bairro",
      address_city: "cidade",
      cost_freight: 5,
      status: OrderStatus.INICIALIZADO,
      payment: "pix",
      withdrawal: "local",
      reference_point: "em frente a padaria",
      change_of_money: 0,
      total: 30,
      orderToProducts: [
        {
          id: 1,
          amount: 2,
          observation: "obs",

          meet_options: "carne, frango",

          total_item: 20,
          order_id: 1,
          product_id: 1,
          created_at: new Date(),
          orders: new Orders({
            id: 1,

            client_name: "paulo",
            phone: "999999999",
            cep: "375000-000",

            address_street: "rua",

            address_number: 1,

            address_neighborhood: "bairro",

            address_city: "cidade",

            cost_freight: 5,
            status: OrderStatus.INICIALIZADO,
            payment: "pix",
            withdrawal: "local",

            reference_point: "em frente a padaria",

            change_of_money: 0,
            total: 30,
          }),
          products: new Products({ id: 1, name: 'produto 1', price: 10, type: ProductType.MARMITA, size: ProductSize.PEQUENA, description: 'teste', status: true, image: null, created_at: new Date(), updated_at: new Date(), orderToProducts: [] })
        }
      ]
    }
  ),
  new Orders(
    {
      id: 2,
      client_name: "ana",
      phone: "999999999",
      cep: "375000-000",
      address_street: "rua",
      address_number: 12,
      address_neighborhood: "bairro",
      address_city: "cidade",
      cost_freight: 5,
      status: OrderStatus.INICIALIZADO,
      payment: "pix",
      withdrawal: "local",
      reference_point: "em frente a padaria",
      change_of_money: 0,
      total: 30,
      orderToProducts: [
        {
          id: 2,
          amount: 2,
          observation: "obs",

          meet_options: "carne, frango",

          total_item: 20,
          order_id: 2,
          product_id: 2,
          created_at: new Date(),
          orders: new Orders({
            id: 2,

            client_name: "ana",
            phone: "999999999",
            cep: "375000-000",

            address_street: "rua",

            address_number: 12,

            address_neighborhood: "bairro",

            address_city: "cidade",

            cost_freight: 5,
            status: OrderStatus.INICIALIZADO,
            payment: "pix",
            withdrawal: "local",

            reference_point: "em frente a padaria",

            change_of_money: 0,
            total: 30,
          }),
          products: new Products({ id: 2, name: 'produto 2', price: 20, type: ProductType.MARMITA, size: ProductSize.MEDIA, description: 'teste', status: true, image: null, created_at: new Date(), updated_at: new Date(), orderToProducts: [] })
        }
      ]
    }
  )
];

describe('Register Controller', () => {
  let orderController: OrderController;
  let orderService: OrderService;
  let orderProductService: OrderProductService;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            updateStatus: jest.fn().mockResolvedValueOnce(OrderStatus.ANDAMENTO),
            findById: jest.fn().mockResolvedValue(ordersList[0]),
            findAll: jest.fn().mockResolvedValue(ordersList),
          }
        },
        {
          provide: OrderProductService,
          useValue: {}
        },
        {
          provide: ProductService,
          useValue: {}
        }
      ]
    }).compile();

    orderController = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
    orderProductService = module.get<OrderProductService>(OrderProductService);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(orderController).toBeDefined();
    expect(orderService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a order list successfully', async () => {
      const result = await orderService.findAll({});
      expect(result).toEqual(ordersList);
    });
  });

  describe('getByID', () => {
    it('should return a order successfully', async () => {
      const result = await orderService.findById('1');
      expect(result).toEqual(ordersList[0]);
    });
  });

  describe('updateStatus', () => {
    it('should return a updated status order successfully', async () => {
      const order = ordersList[1];
      order.status = OrderStatus.ANDAMENTO;

      const result = await orderService.updateStatus(order, '2');
      expect(result).toEqual(OrderStatus.ANDAMENTO);
    });
  });

});

