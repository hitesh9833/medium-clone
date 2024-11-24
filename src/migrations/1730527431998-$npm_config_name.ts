import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1730527431998 implements MigrationInterface {
    name = ' $npmConfigName1730527431998'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "articles" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "body" character varying NOT NULL DEFAULT '', "tagList" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "favouritesCount" integer NOT NULL DEFAULT '0', "authorId" integer, CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "medium-users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "bio" character varying NOT NULL DEFAULT '', "image" character varying NOT NULL DEFAULT '', "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_ea0cdb87f55557ee6bf0cc96d8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "medium-users_favorites_articles" ("mediumUsersId" integer NOT NULL, "articlesId" integer NOT NULL, CONSTRAINT "PK_8ef3d89e7e633a105b6c60da295" PRIMARY KEY ("mediumUsersId", "articlesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c46c6cf0abe85801ff800c8254" ON "medium-users_favorites_articles" ("mediumUsersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_16e3c5d2e2ebffadd80230174e" ON "medium-users_favorites_articles" ("articlesId") `);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34" FOREIGN KEY ("authorId") REFERENCES "medium-users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "medium-users_favorites_articles" ADD CONSTRAINT "FK_c46c6cf0abe85801ff800c82541" FOREIGN KEY ("mediumUsersId") REFERENCES "medium-users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "medium-users_favorites_articles" ADD CONSTRAINT "FK_16e3c5d2e2ebffadd80230174ef" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medium-users_favorites_articles" DROP CONSTRAINT "FK_16e3c5d2e2ebffadd80230174ef"`);
        await queryRunner.query(`ALTER TABLE "medium-users_favorites_articles" DROP CONSTRAINT "FK_c46c6cf0abe85801ff800c82541"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_16e3c5d2e2ebffadd80230174e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c46c6cf0abe85801ff800c8254"`);
        await queryRunner.query(`DROP TABLE "medium-users_favorites_articles"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "medium-users"`);
        await queryRunner.query(`DROP TABLE "articles"`);
    }

}
