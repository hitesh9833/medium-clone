import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const config:TypeOrmModuleOptions = {
    type:'postgres',
    host:'10.13.128.116',
    port:5432,
    username:'postgres',
    password:"admin",
    database:'euronet',
    entities:[__dirname + '**/*/.entity{.ts,.js}']
}

export default config;