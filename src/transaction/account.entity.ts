import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  balance: number
}