import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Addition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('float')
  price: number;

  @Column({default: true})
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(addition?: Partial<Addition>){
    this.id = addition?.id;
    this.name = addition?.name;
    this.price = addition?.price;
    this.status = addition?.status;
    this.createdAt = addition?.createdAt;
    this.updatedAt = addition?.updatedAt;
  }
}
