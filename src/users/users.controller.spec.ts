
import { Test, TestingModule } from '@nestjs/testing';
import { Users } from './entities/users.entity';
import { UserRole } from './user-roles.enum';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const usersList: Users[] = [
  new Users({id: 1, name: 'Carlos', username: "cadu", email: "carlos@gmail.com", password: "123456", role: UserRole.ADMIN, createdAt: new Date(), updatedAt: new Date()}),
  new Users({id: 2, name: 'Ana Beatriz', username: "ana", email: "ana@gmail.com", password: "123456", role: UserRole.USER, createdAt: new Date(), updatedAt: new Date()}),
  new Users({id: 3, name: 'Rafael Augusto', username: "rafa", email: "rafael@gmail.com", password: "123456", role: UserRole.ADMIN, createdAt: new Date(), updatedAt: new Date()})
];

describe('Register Controller', () => {
    let userController: UsersController;
    let userService: UsersService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [UsersController],
        providers: [
          {
            provide: UsersService,
            useValue: {
              create: jest.fn().mockResolvedValue(
                new Users({id: 4, name: 'Sabrina Freitas', username: "sabrina", email: "sabrina@gmail.com", password: "123456", role: UserRole.ADMIN, createdAt: new Date(), updatedAt: new Date()})
              ),
              updateProfileUser: jest.fn().mockResolvedValue(usersList[1]),
              findById: jest.fn().mockResolvedValue(usersList[0]),
              findAll: jest.fn().mockResolvedValue(usersList),
              deleteUser: jest.fn().mockResolvedValue(true),
            }
          }
        ]
      }).compile();

      userController = module.get<UsersController>(UsersController);
      userService = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
      expect(userController).toBeDefined();
      expect(userService).toBeDefined();
    });

    describe('getAll', () => {
      it('should return a user list successfully', async () => {
        const result = await userService.findAll();
        expect(result).toEqual(usersList);
      });
    });

    describe('getByID', () => {
      it('should return a user successfully', async () => {
        const result = await userService.findById('1');
        expect(result).toEqual(usersList[0]);
      });
    });

    describe('create', () => {
      it('should return a save user successfully', async () => {
        const user = new Users({id: 4, name: 'Sabrina Freitas', username: "sabrina", email: "sabrina@gmail.com", password: "123456", role: UserRole.ADMIN, createdAt: new Date(), updatedAt: new Date()})

        const result = await userService.create(user);
        expect(result.username).toEqual(user.username);
      });
    });

    describe('update', () => {
      it('should return a updated user successfully', async () => {
        const user =  usersList[1];
        user.name = 'Luzia';

        const result = await userService.updateProfileUser('2', user);
        expect(result.name).toEqual(user.name);
      });
    });

    describe('delete', () => {
      it('should return a true value when user is deleted', async () => {
        const result = await userService.deleteUser('3');
        expect(result).toBeTruthy();
      });
    });
});