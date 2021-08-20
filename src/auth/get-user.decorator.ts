import { createParamDecorator } from '@nestjs/common';
import { Users } from 'src/users/entities/users.entity';

export const GetUser = createParamDecorator(
  (data, req): Users => {
    return req.user;
  },
);
