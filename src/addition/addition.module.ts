import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Addition } from './entities/addition.entity';
import { AdditionService } from './addition.service';
import { AdditionController } from './addition.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Addition]),
    ],
    controllers: [AdditionController],
    providers: [AdditionService]
})
export class AdditionModule {}
