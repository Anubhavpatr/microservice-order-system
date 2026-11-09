import { UserRepository } from "../repositories/UserRepositories"

// Register all repositories available to transactions
export interface RepositoryRegistry {
  users: UserRepository;
}

// Extract only method names from a repository interface
type RepositoryMethodKeys<T> = {
  [K in keyof T]:
    T[K] extends (...args: never[]) => unknown
      ? K
      : never;
}[keyof T];

// Allow selecting entire repositories OR individual APIs
export type TransactionSelection =
  | readonly (keyof RepositoryRegistry)[]
  | {
      [K in keyof RepositoryRegistry]?:
        readonly RepositoryMethodKeys<RepositoryRegistry[K]>[];
    };

// Determine the exact repositories and methods available
export type TransactionContext<
  S extends TransactionSelection
> =
  S extends readonly (infer K)[]
    ? Pick<
        RepositoryRegistry,
        Extract<K, keyof RepositoryRegistry>
      >
    : {
        [K in keyof S & keyof RepositoryRegistry]:
          Pick<
            RepositoryRegistry[K],
            Extract<
              S[K] extends readonly (infer M)[]
                ? M
                : never,
              keyof RepositoryRegistry[K]
            >
          >;
      };

// Database-independent transaction interface
export interface TransactionRunner {
  run<
    const S extends TransactionSelection,
    Result
  >(
    selection: S,
    callback: (
      context: TransactionContext<S>
    ) => Promise<Result>,

    options?: TransactionOptions
  ): Promise<Result>;
}

export type TransactionIsolationLevel =
  | "READ UNCOMMITTED"
  | "READ COMMITTED"
  | "REPEATABLE READ"
  | "SERIALIZABLE";

export interface TransactionOptions {
  isolationLevel?: TransactionIsolationLevel;
}