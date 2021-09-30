import { InMemoryUsersRepository }  from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";

import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUser: CreateUserUseCase;

describe("CreateUserUseCase", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUser = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to crate a new user", async () => {
        const user = await createUser.execute({
            name: "User",
            email: "test@gmail.com",
            password: "123456",
        });

        expect(user).toHaveProperty("id");
    });

    it("should not be able to create a new user with same email from another", async () => {
        await createUser.execute({
            name: "User 01",
            email: "test@gmail.com",
            password: "123456",
        });

        await expect(
            createUser.execute({
                name: "User 02",
                email: "test@gmail.com",
                password: "123456",
            }),
        ).rejects.toBeInstanceOf(CreateUserError);
    });
});
