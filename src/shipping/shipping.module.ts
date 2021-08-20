import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipping } from './entities/shipping.entity';
import { ShippingService } from './shipping.service';
import { ShippingController } from './shipping.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Shipping]),
    ],
    controllers: [ShippingController],
    providers: [ShippingService]
})
export class ShippingModule {}
