import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity("users")
export class UserEntity {
  @PrimaryColumn({ generated: false })
  id: string

  @Column()
  first_name: string

  @Column()
  last_name: string

  @Column()
  language_code: string

  @Column()
  is_premium: boolean

  @Column()
  age: number

  @Column()
  gender: "M" | "W"

  @Column()
  username: string

  @CreateDateColumn()
  created_at: string

  @UpdateDateColumn()
  updated_at: string
}
