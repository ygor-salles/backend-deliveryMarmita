import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Addition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('real')
  price: number;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor(addition?: Partial<Addition>) {
    this.id = addition?.id;
    this.name = addition?.name;
    this.price = addition?.price;
    this.status = addition?.status;
    this.created_at = addition?.created_at;
    this.updated_at = addition?.updated_at;
  }
}
