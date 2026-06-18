import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1781178423169 implements MigrationInterface {
    name = 'InitMigration1781178423169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."recurring_availability_dayofweek_enum" AS ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY')`);
        await queryRunner.query(`CREATE TABLE "recurring_availability" ("id" SERIAL NOT NULL, "dayOfWeek" "public"."recurring_availability_dayofweek_enum" NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "doctorProfileId" integer, CONSTRAINT "PK_2464dd095ba418858c1aa3f4e01" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "custom_availability" ("id" SERIAL NOT NULL, "date" date NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "reason" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "doctorProfileId" integer, CONSTRAINT "PK_e9b8fa5803ca3d6554a7ddf7045" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "recurring_availability" ADD CONSTRAINT "FK_988d39de6521504d5dc9ac0b9f5" FOREIGN KEY ("doctorProfileId") REFERENCES "doctor_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "custom_availability" ADD CONSTRAINT "FK_4b01248ade4901e776f8ed260f8" FOREIGN KEY ("doctorProfileId") REFERENCES "doctor_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "custom_availability" DROP CONSTRAINT "FK_4b01248ade4901e776f8ed260f8"`);
        await queryRunner.query(`ALTER TABLE "recurring_availability" DROP CONSTRAINT "FK_988d39de6521504d5dc9ac0b9f5"`);
        await queryRunner.query(`DROP TABLE "custom_availability"`);
        await queryRunner.query(`DROP TABLE "recurring_availability"`);
        await queryRunner.query(`DROP TYPE "public"."recurring_availability_dayofweek_enum"`);
    }

}
