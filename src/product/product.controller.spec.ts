import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { Products } from './entities/products.entity';
import { ProductSize } from './product-size.enum';
import { ProductType } from './product-type.enum';
import { ProductService } from './product.service';

const productsList: Products[] = [
  new Products({id: 1, name: 'produto 1', price: 10, type: ProductType.MARMITA, size: ProductSize.PEQUENA, description: 'teste', status: true, image: null, createdAt: new Date(), updatedAt: new Date(), orderToProducts: []}),
  new Products({id: 2, name: 'produto 2', price: 20, type: ProductType.MARMITA, size: ProductSize.MEDIA, description: 'teste', status: true, image: null, createdAt: new Date(), updatedAt: new Date(), orderToProducts: []}),
  new Products({id: 3, name: 'produto 3', price: 30, type: ProductType.MARMITA, size: ProductSize.GRANDE, description: 'teste', status: true, image: null, createdAt: new Date(), updatedAt: new Date(), orderToProducts: []}),
];

describe('Register Controller', () => {
    let productController: ProductController;
    let productService: ProductService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [ProductController],
        providers: [
          {
            provide: ProductService,
            useValue: {
              create: jest.fn().mockResolvedValue(
                new Products({
                  id: 4, 
                  name: 'produto 4', 
                  price: 40, 
                  type: ProductType.MARMITA, 
                  size: ProductSize.GRANDE, 
                  description: 'teste', 
                  status: true, 
                  image: null, 
                  createdAt: new Date(), 
                  updatedAt: new Date(), 
                  orderToProducts: []
                })
              ),
              update: jest.fn().mockResolvedValue(productsList[1]),
              updateStatus: jest.fn().mockResolvedValueOnce(false),
              findById: jest.fn().mockResolvedValue(productsList[0]),
              findAll: jest.fn().mockResolvedValue(productsList),
              delete: jest.fn().mockResolvedValue(true),
              findBySize: jest.fn(),
            }
          }

        ]
      }).compile();

      productController = module.get<ProductController>(ProductController);
      productService = module.get<ProductService>(ProductService);
    });

    it('should be defined', () => {
      expect(productController).toBeDefined();
      expect(productService).toBeDefined();
    });

    describe('getAll', () => {
      it('should return a product list successfully', async () => {
        const result = await productService.findAll({});
        expect(result).toEqual(productsList);
      });
    });

    describe('getByID', () => {
      it('should return a product successfully', async () => {
        const result = await productService.findById('1');
        expect(result).toEqual(productsList[0]);
      });
    });

    describe('create', () => {
      it('should return a save product successfully', async () => {
        const product =  new Products({
          id: 4, 
          name: 'produto 4', 
          price: 40, 
          type: ProductType.MARMITA, 
          size: ProductSize.GRANDE, 
          description: 'teste', 
          status: true, 
          image: null, 
          createdAt: new Date(), 
          updatedAt: new Date(), 
          orderToProducts: []
        });

        const result = await productService.create(product);
        expect(result.name).toEqual(product.name);
      });
    });

    describe('update', () => {
      it('should return a updated product successfully', async () => {
        const product =  productsList[1];
        product.name = 'produto 2 alterado';
        product.price = 25;

        const result = await productService.update(product, '2');
        expect(result.price).toEqual(product.price);
      });
    });

    describe('updateStatus', () => {
      it('should return a updated product successfully', async () => {
        const product =  productsList[1];
        product.status = false;

        const result = await productService.updateStatus(product, '2');
        expect(result).toEqual(product.status);
      });
    });

    describe('delete', () => {
      it('should return a true value when product is deleted', async () => {
        const result = await productService.delete('3');
        expect(result).toBeTruthy();
      });
    });
});

