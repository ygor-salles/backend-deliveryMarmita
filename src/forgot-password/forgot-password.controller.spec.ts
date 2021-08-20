import { Test, TestingModule } from '@nestjs/testing';
import { Users } from 'src/users/entities/users.entity';
import { UserRole } from 'src/users/user-roles.enum';
import { ForgotPasswordController } from './forgot-password.controller';
import { ForgotPasswordService } from './forgot-password.service';

describe('Register Controller', () => {
    let forgotPasswordController: ForgotPasswordController;
    let forgotPasswordService: ForgotPasswordService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [ForgotPasswordController],
        providers: [
          {
            provide: ForgotPasswordService,
            useValue: {
              forgotPassword: jest.fn().mockResolvedValue(
                new Users({id: 4, name: 'Sabrina Freitas', username: "sabrina", email: "sabrina@gmail.com", password: "123456", role: UserRole.ADMIN, createdAt: new Date(), updatedAt: new Date()})
              ),
            }
          }
        ]
      }).compile();

      forgotPasswordController = module.get<ForgotPasswordController>(ForgotPasswordController);
      forgotPasswordService = module.get<ForgotPasswordService>(ForgotPasswordService);
    });

    it('should be defined', () => {
      expect(forgotPasswordController).toBeDefined();
      expect(forgotPasswordService).toBeDefined();
    });

    describe('changePassword', () => {
      it('should return a updated user successfully', async () => {
        const forgot = {
          "email": "sabrina@gmail.com"
        }
        const result = await forgotPasswordService.forgotPassword(forgot);
        expect(result.email).toEqual('sabrina@gmail.com');
      });
    });

});