import {
    CreateUserInput
} from "../domain/repositories/UserRepositories";

import {
    TransactionRunner
} from "../domain/transactions/TransactionContext";

import { hashPassword } from "../utils/password";

export class UserService {

    constructor(
        private readonly transactionRunner: TransactionRunner
    ) {}

    // No explicit transaction needed
    async getUser(id: string) {
        return await this.transactionRunner.run(
            {
                users : ["findById"]
            },
            async ({users}) => {

                return await users.findById(id);
            },
            {
                isolationLevel : "READ COMMITTED"
            }
        )
    }

    // No explicit transaction needed
    async getUserByEmail(email: string) {
        return await this.transactionRunner.run(
            {
                users: ["findByEmail"]   
            },
            async ({users}) => {
                return await users.findByEmail(email);
            },
            {
                isolationLevel : "READ COMMITTED"
            }
        );
    }

    // Transaction for deleting a user
    async deleteUser(id: string) {

        await this.transactionRunner.run(
            {
                users: ["delete"]
            },

            async ({ users }) => {
                await users.delete(id);
            },

            {
                isolationLevel: "READ COMMITTED"
            }
        );
    }

    // Transaction for creating a user
    async createUser(user: CreateUserInput) {

        // Hash password before starting transaction
        const hashedPassword = await hashPassword(
            user.password
        );

        return this.transactionRunner.run(
            {
                users: ["findByEmail", "create"]
            },

            async ({ users }) => {

                // Business validation
                const existingUser =
                    await users.findByEmail(user.email);

                if (existingUser) {
                    throw new Error("User already exists");
                }

                // Create user using transactional repository
                const createdUser = await users.create({
                    ...user,
                    password: hashedPassword
                });

                return createdUser;
            },

            {
                isolationLevel: "READ COMMITTED"
            }
        );
    }
}