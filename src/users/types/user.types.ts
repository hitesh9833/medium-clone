import { UserEntity } from "../create-user.entity";


export type UserType = Omit<UserEntity,'hashPassword'>