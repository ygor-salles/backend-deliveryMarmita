
import { Test, TestingModule } from '@nestjs/testing';
import { AdditionController } from './addition.controller';
import { AdditionService } from './addition.service';
import { Addition } from './entities/addition.entity';

const additionsList: Addition[] = [
  new Addition({id: 1, name: 'acréscimo 1', price: 10, status: true, createdAt: new Date(), updatedAt: new Date()}),
  new Addition({id: 2, name: 'acréscimo 2', price: 20, status: true, createdAt: new Date(), updatedAt: new Date()}),
  new Addition({id: 3, name: 'acréscimo 3', price: 30, status: true, createdAt: new Date(), updatedAt: new Date()}),
];

describe('Register Controller', () => {
    let additionController: AdditionController;
    let additionService: AdditionService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [AdditionController],
        providers: [
          {
            provide: AdditionService,
            useValue: {
              create: jest.fn().mockResolvedValue(
                new Addition({id: 4, name: 'acréscimo 4', price: 40, status: true, createdAt: new Date(), updatedAt: new Date()}),
              ),
              update: jest.fn().mockResolvedValue(additionsList[1]),
              findById: jest.fn().mockResolvedValue(additionsList[0]),
              findAll: jest.fn().mockResolvedValue(additionsList),
              delete: jest.fn().mockResolvedValue(true),
            }
          }
        ]
      }).compile();

      additionController = module.get<AdditionController>(AdditionController);
      additionService = module.get<AdditionService>(AdditionService);
    });

    it('should be defined', () => {
      expect(additionController).toBeDefined();
      expect(additionService).toBeDefined();
    });

    describe('getAll', () => {
      it('should return a addition list successfully', async () => {
        const result = await additionService.findAll({});
        expect(result).toEqual(additionsList);
      });
    });

    describe('getByID', () => {
      it('should return a addition successfully', async () => {
        const result = await additionService.findById('1');
        expect(result).toEqual(additionsList[0]);
      });
    });

    describe('create', () => {
      it('should return a save addition successfully', async () => {
        const addition = new Addition({id: 4, name: 'acréscimo 4', price: 40, status: true, createdAt: new Date(), updatedAt: new Date()});

        const result = await additionService.create(addition);
        expect(result.price).toEqual(addition.price);
      });
    });

    describe('update', () => {
      it('should return a updated addition successfully', async () => {
        const addition =  additionsList[0];
        addition.name = 'acréscimo 2';

        const result = await additionService.update('2', addition);
        expect(result.name).toEqual(addition.name);
      });
    });

    describe('delete', () => {
      it('should return a true value when addition is deleted', async () => {
        const result = await additionService.delete('3');
        expect(result).toBeTruthy();
      });
    });
});