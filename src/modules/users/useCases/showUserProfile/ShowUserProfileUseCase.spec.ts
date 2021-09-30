import { InMemoryUsersRepository }  from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";

import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfile: ShowUserProfileUseCase;

describe("ShowUserProfileUseCase", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        showUserProfile = new ShowUserProfileUseCase(inMemoryUsersRepository);
    });

    it("should be able to crate a new user", async () => {
        const user = await inMemoryUsersRepository.create({
            name: "User",
            email: "test@gmail.com",
            password: "123456",
        });

        const showUser = await showUserProfile.execute(String(user.id));

        expect(showUser.name).toBe("User");
    });

    it("should be able to inform when an user is non-exists", async () => {
        await expect(
            showUserProfile.execute('non-exists-user-id'),
        ).rejects.toBeInstanceOf(ShowUserProfileError);
    });
});
