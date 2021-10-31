import { Orders } from 'src/order/entities/orders.entity';
import { Products } from 'src/product/entities/products.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  readonly order_id: number;

  @Column()
  readonly product_id: number

  @Column()
  amount: number;

  @Column({ type: 'varchar', length: 4000, nullable: true })
  observation: string;

  @Column({ nullable: true })
  meet_options: string;

  @Column('real')
  total_item: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Orders, (orders) => orders.orderToProducts)
  @JoinColumn([{ name: "order_id", referencedColumnName: "id" }])
  orders: Orders;

  @ManyToOne(() => Products, (products) => products.orderToProducts, { eager: true })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  products: Products;
}
