export interface User {
    id : string;
    name : string;
    email : string;
    password: string;
}

export type CreateUserInput = Omit<User, "id">;

export interface UserWithOutPassword extends Omit<User,"password">{}

export interface UserRepository {
  findById(id: string): Promise<UserWithOutPassword | null>;

  findByEmail(email : string) : Promise<UserWithOutPassword | null>

  create(user: Omit<User, "id">): Promise<UserWithOutPassword>;

  delete(id: string): Promise<void>;
}
