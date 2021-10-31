import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Shipping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  neighborhood: string;

  @Column('real')
  value: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor(shipping?: Partial<Shipping>) {
    this.id = shipping?.id;
    this.neighborhood = shipping?.neighborhood;
    this.value = shipping?.value;
  }
}
