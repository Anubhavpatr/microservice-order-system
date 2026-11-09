import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export class UserEntity {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        type: "varchar",
        length: 255,
        unique: true,
        nullable : false
    })
    email!: string

    // User's name
    @Column({
        type: "varchar",
        length: 100,
        nullable : false
    })
    name!: string

    @Column({
        name: "password_hash",
        select: false,
        nullable : false
    })
    passwordHash!: string;

}