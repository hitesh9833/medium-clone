import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { AuthGuard } from "../users/guards/auth.guard";
import { User } from "../users/decorators/user.decorator";
import { UserEntity } from "../users/create-user.entity";
import { CreateArticleDto } from "./dto/create-article.dto";
import { ArticleResponseInterface } from "./types/articleResponse.interface";
import { ArticlesResponseInterface } from "./types/articlesResponse.interface";
import { BackendValidationPipe } from "../shared/pipes";

@Controller('article')
export class ArticleController {
    constructor(
        private readonly articleService: ArticleService
    ) { }


    @Get()
    @UseGuards(AuthGuard)
    async findAll(
        @User('id') currentUserId: number,
        @Query() query: any
    ): Promise<ArticlesResponseInterface> {
        return this.articleService.findAll(currentUserId, query)
    }

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new BackendValidationPipe())
    async createArticle(
        @User() user: UserEntity,
        @Body('article') createArticleDto: CreateArticleDto
    ): Promise<ArticleResponseInterface> {
        const article = await this.articleService.createArticle(user, createArticleDto);
        return this.articleService.buildArticleResponse(article)
    }

    @Get(':slug')
    @UseGuards(AuthGuard)
    async getArticleBySlug(@Param('slug') slug: string): Promise<ArticleResponseInterface> {
        const article = await this.articleService.getArticle(slug);
        return this.articleService.buildArticleResponse(article)
    }

    @Delete(':slug')
    @UseGuards(AuthGuard)
    async deleteArticle(
        @User('id') currentUserId: number,
        @Param('slug') slug: string
    ) {

        return this.articleService.deleteArticle(currentUserId, slug)

    }

    @Put(':slug')
    @UseGuards(AuthGuard)
    @UsePipes(new BackendValidationPipe())
    async updateArticle(
        @User('id') userId: number,
        @Param('slug') slug: string,
        @Body('article') updateArticleDto: CreateArticleDto
    ) {
        const article = await this.articleService.updateArticle(userId, slug, updateArticleDto);
        return this.articleService.buildArticleResponse(article);
    }

    @Post(':slug/favorite')
    @UseGuards(AuthGuard)
    async addArticleTofavorite(
        @User('id') userId: number,
        @Param('slug') slug: string
    ): Promise<ArticleResponseInterface> {
        const article = await this.articleService.addArticleTofavorite(slug, userId)
        return this.articleService.buildArticleResponse(article)
    }

    @Delete(':slug/favorite')
    @UseGuards(AuthGuard)
    async deleteArticleFromFavorite(
        @User('id') userId: number,
        @Param('slug') slug: string
    ): Promise<ArticleResponseInterface> {
        const article = await this.articleService.deleteArticleFromFavorite(slug, userId);
        return this.articleService.buildArticleResponse(article)
    }


    @Get('feed')
    @UseGuards(AuthGuard)
    async getFeed(
        @User() currentUserId: number,
        @Query() query: any
    ): Promise<ArticlesResponseInterface> {
        return await this.articleService.getFeed(currentUserId, query);

    }
}