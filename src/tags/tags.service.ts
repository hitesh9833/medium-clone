import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TagsEntity } from "./tags.entity";
import { Repository } from "typeorm";

@Injectable()
export class TagsService{
    constructor(
        @InjectRepository(TagsEntity) private readonly tagRepository:Repository<TagsEntity>
    ){}
    async findAll():Promise<TagsEntity[]>{
       return await this.tagRepository.find()
    }
}