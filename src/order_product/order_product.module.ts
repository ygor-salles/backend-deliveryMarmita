import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderProduct } from "src/order_product/entities/order_product.entity";
import { OrderProductService } from "./order_product.service";

@Module({
  imports: [TypeOrmModule.forFeature([OrderProduct])],
  controllers: [],
  providers: [OrderProductService],
})
export class OrderProductModule {}
