import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../users/create-user.entity";
import { FollowEntity } from "./follow.entity";

@Module({
    imports:[TypeOrmModule.forFeature([UserEntity , FollowEntity])],
    controllers:[ProfileController],
    providers:[ProfileService]
})
export class ProfileModule{}