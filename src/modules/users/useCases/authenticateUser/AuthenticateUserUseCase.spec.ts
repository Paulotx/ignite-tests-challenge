import { hash } from "bcryptjs";

import { InMemoryUsersRepository }  from "../../repositories/in-memory/InMemoryUsersRepository";

import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUser: AuthenticateUserUseCase;

describe("AuthenticateUserUseCase", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        authenticateUser = new AuthenticateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to authenticate an user", async () => {
        await inMemoryUsersRepository.create({
            name: "User",
            email: "test@gmail.com",
            password: await hash("1234", 8),
        });

        const result = await authenticateUser.execute({
            email: "test@gmail.com",
            password: "1234",
        });

        expect(result).toHaveProperty("token");
    });

    it("should not be able to authenticate a nonexistent user", async () => {
        expect(async () => {
            await authenticateUser.execute({
                email: "email@teste.com",
                password: "12345",
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

    it("should not be able to authenticate with incorrect password", async () => {
        const user = await inMemoryUsersRepository.create({
            name: "User",
            email: "test@gmail.com",
            password: "123456",
        });

        expect(async () => {
            await authenticateUser.execute({
                email: "test@gmail.com",
                password: "incorrect_password",
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });
});
