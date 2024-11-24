import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DeleteResult, Repository } from "typeorm";
import { ArticleEntity } from "./article.entity";
import { UserEntity } from "../users/create-user.entity";
import { CreateArticleDto } from "./dto/create-article.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ArticleResponseInterface } from "./types/articleResponse.interface";
import slugify from "slugify";
import { ArticlesResponseInterface } from "./types/articlesResponse.interface";
import { FollowEntity } from "../profile/follow.entity";

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(FollowEntity)
        private readonly followRepository: Repository<FollowEntity>
    ) { }

    async findAll(userId: number, query: any): Promise<ArticlesResponseInterface> {
        const queryBuilder = this.articleRepository
            .createQueryBuilder('articles')
            .leftJoinAndSelect('articles.author', 'author')



        if (query.tag) {
            queryBuilder.andWhere('articles.tagList LIKE :tag', {
                tag: `%${query.tag}%`
            })
        }

        if (query.author) {
            const author = await this.userRepository.findOne({
                where: {
                    username: query.author
                }
            })
            queryBuilder.andWhere('articles.authorId = :id', {
                id: author.id
            })
        }

        if (query.favorited) {
            const author = await this.userRepository.findOne({
                where: { username: query.favorited },
                relations: ["favorites"]
            })

            const ids = author.favorites.map(ele => ele.id);

            if (ids.length > 0) {
                queryBuilder.andWhere('articles.authorId IN (:...ids)', { ids })
            } else {
                queryBuilder.andWhere("1=0")
            }

        }



        queryBuilder.orderBy('articles.createdAt', 'DESC')

        const articlesCount = await queryBuilder.getCount();

        if (query.limit) {
            queryBuilder.limit(query.limit)
        }
        if (query.offset) {
            queryBuilder.offset(query.offset)
        }

        let favoriteIds: number[] = [];
        if (userId) {
            const currentUser = await this.userRepository.findOne({
                where: { id: userId },
                relations: ['favorites']
            })
            favoriteIds = currentUser.favorites.map(favorite => favorite.id);
        }


        const articles = await queryBuilder.getMany();
        const articlesWithFavorited = articles.map(article => {
            const favorited = favoriteIds.includes(article.id);
            return { ...article, favorited }
        })
        return { articles: articlesWithFavorited, articlesCount }
    }

    async createArticle(user: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
        const newArticle = new ArticleEntity();
        Object.assign(newArticle, createArticleDto);
        if (!newArticle.tagList) {
            newArticle.tagList = []
        }

        newArticle.author = user;
        newArticle.slug = this.generateSlug(createArticleDto.title)

        return this.articleRepository.save(newArticle)
    }



    async getArticle(slug: string): Promise<ArticleEntity> {
        const article = await this.articleRepository.findOne({
            where: { slug: slug }
        })

        if (!article) {
            throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND)
        }
        return article
    }

    async deleteArticle(userId: number, slug: string): Promise<DeleteResult> {
        const article = await this.getArticle(slug);

        if (article.author.id !== userId) {
            throw new HttpException('You are not authourized', HttpStatus.FORBIDDEN)
        }
        return this.articleRepository.delete({
            slug: slug
        })

    }

    async updateArticle(
        userId: number,
        slug: string,
        updateArticleDto: CreateArticleDto)
        : Promise<ArticleEntity> {

        const article = await this.getArticle(slug);
        if (article.author.id !== userId) {
            throw new HttpException('You are not authourized', HttpStatus.FORBIDDEN)
        }

        Object.assign(article, updateArticleDto);

        return this.articleRepository.save(article)
    }

    async addArticleTofavorite(slug: string, userId: number): Promise<ArticleEntity> {
        const article = await this.getArticle(slug);
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['favorites']
        })

        const isNotFavorited = user.favorites
            .findIndex(articleFavorites => articleFavorites.id == article.id) === -1

        if (isNotFavorited) {
            user.favorites.push(article);
            article.favouritesCount++;
            await this.userRepository.save(user);
            await this.articleRepository.save(article)
        }

        return article
    }

    async deleteArticleFromFavorite(slug: string, userId: number): Promise<ArticleEntity> {
        const article = await this.getArticle(slug);
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['favorites']
        })

        const articleIndex = user.favorites
            .findIndex(articleFavorites => articleFavorites.id == article.id)

        if (articleIndex >= 0) {
            user.favorites.splice(articleIndex, 1);
            article.favouritesCount--;
            await this.userRepository.save(user);
            await this.articleRepository.save(article)
        }

        return article;

    }

    async getFeed(currentUserId: number, query: any): Promise<ArticlesResponseInterface> {


        const follow = await this.followRepository.find({
            where: { followerId: currentUserId }
        })

        if (follow.length == 0) {
            return { articles: [], articlesCount: 0 }
        }

        const followingIds = follow.map(following => following.followingId)

        const queryBuilder = this.articleRepository
            .createQueryBuilder('articles')
            .leftJoinAndSelect('articles.author', 'author')
            .where('articles.authorId IN (:...ids', { ids: followingIds })

        queryBuilder.orderBy('articles.createdAt', "DESC")

        const articlesCount = await queryBuilder.getCount()

        if (query.limit) {
            queryBuilder.limit(query.limit)
        }
        if (query.offset) {
            queryBuilder.offset(query.offset)
        }

        const articles = await queryBuilder.getMany();

        return { articles, articlesCount }

    }


    buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
        return { article }
    }

    private generateSlug(title: string): string {
        return slugify(title) + Math.floor(Math.random() * Math.pow(36, 6)).toString(36)
    }


}