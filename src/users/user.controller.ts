import { Body, Controller, Get, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";
import { UserResponse } from "./types/userResponse.interface";
import { LoginDto } from "./dto/login.dto";
import { User } from "./decorators/user.decorator";
import { UserEntity } from "./create-user.entity";
import { AuthGuard } from "./guards/auth.guard";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }
    @Post()
    @UsePipes(new ValidationPipe())
    async createUser(
        @Body('user') createUserDto: CreateUserDto): Promise<UserResponse> {
        const user = await this.userService.createUser(createUserDto);
        return this.userService.buildUserResponse(user);
    }


    @Post('login')
    @UsePipes(new ValidationPipe())
    async login(@Body('user') loginUserDto: LoginDto): Promise<UserResponse> {
        const user = await this.userService.login(loginUserDto);
        return this.userService.buildUserResponse(user)
    }

    // @Get()
    // async currentUser(
    //     @Req() req:ExpressRequest
    // ): Promise<UserResponse> {
    //     return this.userService.buildUserResponse(req.user)
    // }

    @Get()
    @UseGuards(AuthGuard)
    async currentUser(@User() user: UserEntity): Promise<UserResponse> {  
        return this.userService.buildUserResponse(user)
    }

    @Put()
    @UseGuards(AuthGuard)
    async updateUser(@User('id') userId: number,@Body('user') userUpdateDto:UpdateUserDto){
       const user  =  await this.userService.updateUser(userId,userUpdateDto);
       return this.userService.buildUserResponse(user)
    }
}