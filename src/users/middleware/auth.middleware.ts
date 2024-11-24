import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import {  verify } from "jsonwebtoken";
import { ExpressRequest } from "src/types/expressRequest.interface";
import { UserService } from "../user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly userService:UserService
    ){}
    async use(req: ExpressRequest, _: Response, next: NextFunction) { 
        if (!req.headers.authorization) {
            console.log('req.headers.authorization');
            req.user = null;
            next();
            return;
        }

        const token = req.headers.authorization.split(' ')[1];
        
        if(!token){
            req.user = null;
            next(); 
        }
        try {
            const decode = verify(token, process.env.JWT_SECRET) as any;
            const user = await this.userService.findById(decode.id);
            req.user = user;
            next()
        } catch (error) {
            req.user = null;
            next();
        }

    }
}