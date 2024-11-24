import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./create-user.entity";
import { Repository } from "typeorm";
import { sign } from "jsonwebtoken";
import { UserResponse } from "./types/userResponse.interface";
import { LoginDto } from "./dto/login.dto";
import { compare } from "bcryptjs";
import { UpdateUserDto } from "./dto/update-user.dto";




@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>

    ) { }

    async createUser(createUserDto: CreateUserDto) {
        const user = await this.userRepository.findOne({
            where: {
                email: createUserDto.email,
                username: createUserDto.username
            }
        })

        if (user) {
            throw new HttpException('Email or username already exists', HttpStatus.UNPROCESSABLE_ENTITY)
        }
        const newUser = new UserEntity();
        Object.assign(newUser, createUserDto);
        return this.userRepository.save(newUser)
    }

    async login(loginUserDto:LoginDto):Promise<UserEntity>{
        const user = await this.userRepository.findOne({
            where: {
                email: loginUserDto.email
            },
            select:["id","email",'bio','image','username','password']
        })

        if(!user){
            throw new HttpException('Credentials does not exists', HttpStatus.UNPROCESSABLE_ENTITY) 
        }

        const matchpassword = compare(user.password,user.password);

        if(!matchpassword){
            throw new HttpException('Credentials does not match', HttpStatus.UNPROCESSABLE_ENTITY)
        }
        delete user.password
        return user;

    }

    async findById(userId:number):Promise<UserEntity>{
       const user = await this.userRepository.findOne({
        where:{id:userId}
       })
       return user;
    }

    async updateUser(id:number,userUpdateDto:UpdateUserDto):Promise<UserEntity>{
       const user = await this.findById(id);
       Object.assign(user,userUpdateDto);
       return await this.userRepository.save(user)
    }

    generateToken(user: UserEntity): string {
        return sign({
            id: user.id,
            username: user.username,
            email: user.email
        }, process.env.JWT_SECRET)
    }

    buildUserResponse(user: UserEntity): UserResponse {
        return {
            user: {
                ...user,
                token: this.generateToken(user),
            },
        };
    }
}