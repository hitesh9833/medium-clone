import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { User } from "../users/decorators/user.decorator";
import { ProfileService } from "./profile.service";
import { ProfileResponseInterface } from "./types/profileResponse.interface";
import { AuthGuard } from "../users/guards/auth.guard";


@Controller('profiles')
export class ProfileController{
    constructor(
        private readonly profileService:ProfileService
    ){}
    @Get(':username')
    async getProfile(
        @User() userId:number,
        @Param('username') profileUserName:string
    ):Promise<ProfileResponseInterface>{
        const profile = await this.profileService.getProfile(userId,profileUserName);
        return this.profileService.buildProfileResponse(profile)
    }


    @Post(':username/follow')
    @UseGuards(AuthGuard)
    async followProfile(
        @User() currentUserId:number,
        @Param('username') profileUserName:string
    ):Promise<ProfileResponseInterface>{

        const profile = await this.profileService.followProfile(currentUserId,profileUserName);
        return this.profileService.buildProfileResponse(profile)

    }

    @Delete(':username/unfollow')
    @UseGuards(AuthGuard)
    async unFollowProfile(
        @User() currentUserId:number,
        @Param('username') profileUserName:string 
    ):Promise<ProfileResponseInterface>{

        const profile = await this.profileService.unFollowProfile(currentUserId,profileUserName);
        return this.profileService.buildProfileResponse(profile)
    }
}