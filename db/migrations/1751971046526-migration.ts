import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751971046526 implements MigrationInterface {
    name = 'Migration1751971046526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "expires_in"`);
        await queryRunner.query(`ALTER TABLE "token" ADD "access_token_expires_in" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "token" ADD "refresh_token_expires_in" bigint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "refresh_token_expires_in"`);
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "access_token_expires_in"`);
        await queryRunner.query(`ALTER TABLE "token" ADD "expires_in" bigint NOT NULL`);
    }

}
