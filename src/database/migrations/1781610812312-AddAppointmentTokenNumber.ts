import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAppointmentTokenNumber1781610812312 implements MigrationInterface {
    name = 'AddAppointmentTokenNumber1781610812312'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" ADD "tokenNumber" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "tokenNumber"`);
    }

}
