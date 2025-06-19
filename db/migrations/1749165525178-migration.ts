import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749165525178 implements MigrationInterface {
    name = 'Migration1749165525178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interview_session" DROP COLUMN "skills"`);
        await queryRunner.query(`ALTER TABLE "interview_session" DROP COLUMN "jobDescription"`);
        await queryRunner.query(`ALTER TABLE "interview_session" ADD "jobSkills" text`);
        await queryRunner.query(`ALTER TABLE "interview_session" ADD "jobResponsibilities" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interview_session" DROP COLUMN "jobResponsibilities"`);
        await queryRunner.query(`ALTER TABLE "interview_session" DROP COLUMN "jobSkills"`);
        await queryRunner.query(`ALTER TABLE "interview_session" ADD "jobDescription" text`);
        await queryRunner.query(`ALTER TABLE "interview_session" ADD "skills" text`);
    }

}
