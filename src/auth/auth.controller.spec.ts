
import { Test, TestingModule } from '@nestjs/testing';
import { Users } from 'src/users/entities/users.entity';
import { UserRole } from 'src/users/user-roles.enum';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('Register Controller', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [AuthController],
        providers: [
          {
            provide: AuthService,
            useValue: {
              signUp: jest.fn().mockResolvedValue(
                new Users({id: 4, name: 'Sabrina Freitas', username: "sabrina", email: "sabrina@gmail.com", password: "123456", role: UserRole.ADMIN, createdAt: new Date(), updatedAt: new Date()})
              ),
              signIn: jest.fn().mockResolvedValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbmEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2Mjg5NjA0MjgsImV4cCI6MTYyODk2NDAyOH0.NCAS0_EtwGNqT2WoktH-05e1LGZfiq7ZiMoDY_Tr0qw'),
            }
          }
        ]
      }).compile();

      authController = module.get<AuthController>(AuthController);
      authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
      expect(authController).toBeDefined();
      expect(authService).toBeDefined();
    });

    describe('sign in', () => {
      it('should return a token from user logged', async () => {
        const login = {
          email: "ana@user.com",
          password: "123456"
        };
        const result = await authService.signIn(login);
        expect(result).toEqual('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbmEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2Mjg5NjA0MjgsImV4cCI6MTYyODk2NDAyOH0.NCAS0_EtwGNqT2WoktH-05e1LGZfiq7ZiMoDY_Tr0qw');
      });
    });

    describe('sign up', () => {
      it('should return a save user successfully', async () => {
        const user = new Users({id: 4, name: 'Sabrina Freitas', username: "sabrina", email: "sabrina@gmail.com", password: "123456", role: UserRole.ADMIN, createdAt: new Date(), updatedAt: new Date()})


        const result = await authService.signUp(user);
        expect(result.name).toEqual(user.name);
      });
    });

});