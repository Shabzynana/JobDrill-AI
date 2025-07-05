import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751362004639 implements MigrationInterface {
    name = 'Migration1751362004639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_auth_type_enum" AS ENUM('google', 'local')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "auth_type" "public"."users_auth_type_enum" NOT NULL DEFAULT 'local'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "auth_type"`);
        await queryRunner.query(`DROP TYPE "public"."users_auth_type_enum"`);
    }

}
