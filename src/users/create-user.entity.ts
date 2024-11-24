
import { hash } from "bcryptjs";
import { ArticleEntity } from "../article/article.entity";
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'medium-users'})
export class UserEntity {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    username:string

    @Column({default:''})
    bio:string

    @Column({default:''})
    image:string

    @Column()
    email:string

    @Column({select:false})
    password:string;

    @BeforeInsert()
    async hashPassword(){
        this.password = await hash(this.password,10)
    }

    @OneToMany(()=>ArticleEntity,(article)=>article.author)
    articles:ArticleEntity[]

    @ManyToMany(()=>ArticleEntity)
    @JoinTable()
    favorites:ArticleEntity[]
}