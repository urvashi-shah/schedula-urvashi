import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1781253656568 implements MigrationInterface {
    name = 'InitMigration1781253656568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor_profile" ADD "slotDuration" integer NOT NULL DEFAULT '15'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor_profile" DROP COLUMN "slotDuration"`);
    }

}
