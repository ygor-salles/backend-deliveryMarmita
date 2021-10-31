
import { Test, TestingModule } from '@nestjs/testing';
import { ShippingController } from './shipping.controller';
import { Shipping } from './entities/shipping.entity';
import { ShippingService } from './shipping.service';

const shippingsList: Shipping[] = [
  new Shipping({ id: 1, neighborhood: 'Novo Horizonte', value: 10, created_at: new Date(), updated_at: new Date() }),
  new Shipping({ id: 2, neighborhood: 'Nossa Senhora de Fátima', value: 30, created_at: new Date(), updated_at: new Date() }),
  new Shipping({ id: 3, neighborhood: 'Centro', value: 5, created_at: new Date(), updated_at: new Date() }),
];

describe('Register Controller', () => {
  let shippingController: ShippingController;
  let shippingService: ShippingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShippingController],
      providers: [
        {
          provide: ShippingService,
          useValue: {
            create: jest.fn().mockResolvedValue(
              new Shipping({
                id: 4,
                neighborhood: 'Santo Antônio',
                value: 100,
              })
            ),
            update: jest.fn().mockResolvedValue(shippingsList[1]),
            findById: jest.fn().mockResolvedValue(shippingsList[0]),
            findAll: jest.fn().mockResolvedValue(shippingsList),
            delete: jest.fn().mockResolvedValue(true),
          }
        }

      ]
    }).compile();

    shippingController = module.get<ShippingController>(ShippingController);
    shippingService = module.get<ShippingService>(ShippingService);
  });

  it('should be defined', () => {
    expect(shippingController).toBeDefined();
    expect(shippingService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a shipping list successfully', async () => {
      const result = await shippingService.findAll();
      expect(result).toEqual(shippingsList);
    });
  });

  describe('getByID', () => {
    it('should return a shipping successfully', async () => {
      const result = await shippingService.findById('1');
      expect(result).toEqual(shippingsList[0]);
    });
  });

  describe('create', () => {
    it('should return a save shipping successfully', async () => {
      const shipping = new Shipping({
        id: 4,
        neighborhood: 'Santo Antônio',
        value: 100,
      });

      const result = await shippingService.create(shipping);
      expect(result.value).toEqual(shipping.value);
    });
  });

  describe('update', () => {
    it('should return a updated shipping successfully', async () => {
      const shipping = shippingsList[1];
      shipping.neighborhood = 'Santa Luzia';
      shipping.value = 25;

      const result = await shippingService.update('2', shipping);
      expect(result.neighborhood).toEqual(shipping.neighborhood);
    });
  });

  describe('delete', () => {
    it('should return a true value when shipping is deleted', async () => {
      const result = await shippingService.delete('3');
      expect(result).toBeTruthy();
    });
  });
});