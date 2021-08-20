import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { ForgotPasswordModule } from "./forgot-password/forgot-password.module";
import { ChangePasswordModule } from "./change-password/change-password.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { ProductModule } from "./product/product.module";
import { AuthModule } from "./auth/auth.module";
import { OrderModule } from "./order/order.module";
import { OrderProductModule } from "./order_product/order_product.module";
import { ShippingModule } from "./shipping/shipping.module";
import { AdditionModule } from "./addition/addition.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(),
    UsersModule,
    AuthModule,
    ProductModule,
    OrderModule,
    OrderProductModule,
    ShippingModule,
    AdditionModule,
    ForgotPasswordModule,
    ChangePasswordModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          auth: {
            user: process.env.EMAIL_AUTH_USER,
            pass: process.env.EMAIL_AUTH_PASSWORD
          },
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: process.cwd() + "/templates/emails",
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
