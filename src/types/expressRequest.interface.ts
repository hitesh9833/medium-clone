import { Request } from "express";
import { UserEntity } from "src/users/create-user.entity";

export interface ExpressRequest extends Request {
    user?:UserEntity
}