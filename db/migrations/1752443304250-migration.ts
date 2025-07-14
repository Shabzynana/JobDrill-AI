import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1752443304250 implements MigrationInterface {
    name = 'Migration1752443304250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."interview_session_experiencelevel_enum" AS ENUM('entry', 'mid', 'senior')`);
        await queryRunner.query(`ALTER TABLE "interview_session" ADD "experienceLevel" "public"."interview_session_experiencelevel_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."interview_session_difficultylevel_enum" AS ENUM('basic', 'intermediate', 'advanced')`);
        await queryRunner.query(`ALTER TABLE "interview_session" ADD "difficultyLevel" "public"."interview_session_difficultylevel_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interview_session" DROP COLUMN "difficultyLevel"`);
        await queryRunner.query(`DROP TYPE "public"."interview_session_difficultylevel_enum"`);
        await queryRunner.query(`ALTER TABLE "interview_session" DROP COLUMN "experienceLevel"`);
        await queryRunner.query(`DROP TYPE "public"."interview_session_experiencelevel_enum"`);
    }

}
