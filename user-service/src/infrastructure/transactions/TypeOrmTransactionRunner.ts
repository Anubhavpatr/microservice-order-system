import {
    DataSource,
    EntityManager,
} from "typeorm";

import {
    RepositoryRegistry,
    TransactionSelection,
    TransactionContext,
    TransactionRunner,
    TransactionOptions,
} from "../../domain/transactions/TransactionContext";

import { TypeOrmUserRepository } from "../repositories/TypeOrmUserRepository";

import { UserEntity } from "../../domain/entities/UserEntity";

type RepositoryList =
    readonly (keyof RepositoryRegistry)[];

function isRepositoryList(
    selection: TransactionSelection
): selection is RepositoryList {
    return Array.isArray(selection);
}

// Every factory uses the provided EntityManager
type RepositoryFactories = {
    [K in keyof RepositoryRegistry]:
    (manager: EntityManager) => RepositoryRegistry[K];
};

export class TypeOrmTransactionRunner
    implements TransactionRunner {

    private readonly factories: RepositoryFactories = {

        users: (manager) =>
            new TypeOrmUserRepository(
                manager.getRepository(UserEntity)
            )
    };

    constructor(
        private readonly dataSource: DataSource
    ) { }

    async run<
        const S extends TransactionSelection,
        Result
    >(
        selection: S,
        callback: (
            context: TransactionContext<S>
        ) => Promise<Result>,

        options?: TransactionOptions
    ): Promise<Result> {

        const execute = async (
            manager: EntityManager
        ): Promise<Result> => {

            const context: Record<string, unknown> = {};

            // OPTION 1: Select complete repositories
            if (isRepositoryList(selection)) {
                for (const name of selection) {
                    context[name] = this.factories[name](manager);
                }
            } else {

                // OPTION 2: Select specific repository methods
                for (const [name, methods] of Object.entries(selection)) {

                    const factory =
                        this.factories[name as keyof RepositoryRegistry];

                    if (!factory) {
                        throw new Error(
                            `Unknown transaction repository: ${name}`
                        );
                    }

                    const repository = factory(manager);

                    const selectedMethods: Record<string, unknown> = {};

                    for (const methodName of methods as readonly string[]) {

                        const method = (
                            repository as unknown as Record<string, unknown>
                        )[methodName];

                        if (typeof method !== "function") {
                            throw new Error(
                                `Invalid repository method: ${name}.${methodName}`
                            );
                        }

                        // Preserve the repository instance as `this`
                        selectedMethods[methodName] =
                            method.bind(repository);

                    }

                    context[name] = selectedMethods;
                }

            }

            // Execute all operations in one transaction
            return callback(
                context as TransactionContext<S>
            );

        };

        if (options?.isolationLevel) {

            return this.dataSource.transaction(
                options.isolationLevel,
                execute
            );

        }

        return this.dataSource.transaction(execute);

    }
}