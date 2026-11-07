import { CreateUserInput, UserRepository } from "../domain/repositories/UserRepositories";
import { hashPassword } from "../utils/password";


export class UserService {

    constructor(
        private readonly userRepository: UserRepository
    ) { }

    async getUser(id: string) {
        return this.userRepository.findById(id);
    }

    async getUserByEmail(email : string)
    {
        return this.userRepository.findByEmail(email);
    }

    async deleteUser(id : string)
    {
        await this.userRepository.delete(id);
    }

    async createUser(user: CreateUserInput) {

        const existingUser = await this.userRepository.findByEmail(user.email);

        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await hashPassword(user.password);

        const createdUser = this.userRepository.create({
            ...user,
            password : hashedPassword
        });

        return createdUser;
    }
}