import { UserType } from "./user.types";

export interface UserResponse {
    user: UserType & { token: string };
}