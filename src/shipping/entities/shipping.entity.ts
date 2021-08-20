import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Shipping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  neighborhood: string;

  @Column('float')
  value: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(shipping?: Partial<Shipping>){
    this.id = shipping?.id;
    this.neighborhood = shipping?.neighborhood;
    this.value = shipping?.value;
  }
}
