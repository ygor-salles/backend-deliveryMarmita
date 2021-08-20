import { Test, TestingModule } from '@nestjs/testing';
import { Users } from 'src/users/entities/users.entity';
import { UserRole } from 'src/users/user-roles.enum';
import { ChangePasswordController } from './change-password.controller';
import { ChangePasswordService } from './change-password.service';

describe('Register Controller', () => {
    let changePasswordController: ChangePasswordController;
    let changePasswordService: ChangePasswordService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [ChangePasswordController],
        providers: [
          {
            provide: ChangePasswordService,
            useValue: {
              changePassword: jest.fn().mockResolvedValue(
                new Users({id: 4, name: 'Sabrina Freitas', username: "sabrina", email: "sabrina@gmail.com", password: "123456", role: UserRole.ADMIN, createdAt: new Date(), updatedAt: new Date()})
              ),
            }
          }
        ]
      }).compile();

      changePasswordController = module.get<ChangePasswordController>(ChangePasswordController);
      changePasswordService = module.get<ChangePasswordService>(ChangePasswordService);
    });

    it('should be defined', () => {
      expect(changePasswordController).toBeDefined();
      expect(changePasswordService).toBeDefined();
    });

    describe('changePassword', () => {
      it('should return a updated user successfully', async () => {
        const change = {
          "email": "sabrina@gmail.com",
          "password": "123456",
          "codVerificacao": "sdksjdks123"
        }
        const result = await changePasswordService.changePassword(change);
        expect(result.email).toEqual('sabrina@gmail.com');
      });
    });

});