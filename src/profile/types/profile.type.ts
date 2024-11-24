import { UserType } from "src/users/types/user.types";

export type ProfileType = UserType & {following:boolean}