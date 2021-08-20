import { OrderProduct } from 'src/order_product/entities/order_product.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, DeleteDateColumn } from 'typeorm';
import { ProductSize } from '../product-size.enum';
import { ProductType } from '../product-type.enum';
@Entity()
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('float')
  price: number;

  @Column()
  type: ProductType;
  
  @Column({nullable: true})
  size: ProductSize;

  @Column({ type:'varchar', length: 4000})
  description: string;

  @Column({default: true})
  status: boolean;

  @Column({nullable:true})
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => OrderProduct, productToOrder => productToOrder.products)
  orderToProducts: OrderProduct[];

  constructor(product?: Partial<Products>){
    this.id = product?.id;
    this.name = product?.name;
    this.price = product?.price;
    this.type = product?.type;
    this.size = product?.size;
    this.description = product?.description;
    this.status = product?.status;
    this.image = product?.image;
    this.createdAt = product?.createdAt;
    this.updatedAt = product?.updatedAt;
    this.orderToProducts = product?.orderToProducts;
  }
}
