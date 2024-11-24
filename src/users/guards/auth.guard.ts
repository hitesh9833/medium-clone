import { CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { ExpressRequest } from "src/types/expressRequest.interface";

export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
         const request = context.switchToHttp().getRequest<ExpressRequest>();
         
         if(request.user){
            return true
         }
         throw new HttpException('Unauthorized',HttpStatus.UNAUTHORIZED)
    }
}