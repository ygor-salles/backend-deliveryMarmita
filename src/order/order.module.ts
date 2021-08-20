import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { Orders } from "./entities/orders.entity";
import { OrderProductService } from "src/order_product/order_product.service";
import { OrderProduct } from "src/order_product/entities/order_product.entity";
import { ProductService } from "../product/product.service";
import { Products } from "src/product/entities/products.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Orders, OrderProduct, Products])],
  controllers: [OrderController],
  providers: [OrderService, OrderProductService, ProductService],
})
export class OrderModule {}
