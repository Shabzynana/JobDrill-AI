import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1748696860492 implements MigrationInterface {
    name = 'Migration1748696860492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "score" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "score" SET NOT NULL`);
    }

}
