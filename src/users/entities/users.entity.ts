import { Products } from 'src/product/entities/products.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column({
    unique: true
  })
  email: string;

  @Column({ length: 60 })
  password: string;

  @Column({ nullable: false, type: 'varchar', length: 20 })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(user?: Partial<Users>){
    this.id = user?.id;
    this.name = user?.name;
    this.username = user?.username;
    this.email = user?.email;
    this.password = user?.password;
    this.role = user?.role;
    this.createdAt = user?.createdAt;
    this.updatedAt = user?.updatedAt;
  }
}
