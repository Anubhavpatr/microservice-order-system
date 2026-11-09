import { Repository } from "typeorm";
import { CreateUserInput, User, UserRepository, UserWithOutPassword } from "../../domain/repositories/UserRepositories";
import { UserEntity } from "../../domain/entities/UserEntity";

export class TypeOrmUserRepository implements UserRepository {

    constructor(
        private readonly repository: Repository<UserEntity>
    ) { }

    async findByEmail(email: string): Promise<UserWithOutPassword | null> {
        const user = await this.repository.findOneBy({email});

        if(!user)
        {
            return null;
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email
        }
    }

    async findById(id: string): Promise<UserWithOutPassword | null> {
        const user = await this.repository.findOneBy({ id });

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email
        }
    }

    async create(user: CreateUserInput): Promise<UserWithOutPassword> {

        const newUser = this.repository.create(user);

        const saved = await this.repository.save(newUser);

        return {
            id: saved.id,
            name: saved.name,
            email: saved.email
        };

    }
    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

}