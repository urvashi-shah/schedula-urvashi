import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1781517951092 implements MigrationInterface {
    name = 'InitMigration1781517951092'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."appointment_status_enum" AS ENUM('BOOKED', 'CANCELLED', 'COMPLETED')`);
        await queryRunner.query(`CREATE TABLE "appointment" ("id" SERIAL NOT NULL, "date" date NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "status" "public"."appointment_status_enum" NOT NULL DEFAULT 'BOOKED', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "doctorProfileId" integer, "patientProfileId" integer, CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_141cca7add8c704a1b8f99ed5b3" FOREIGN KEY ("doctorProfileId") REFERENCES "doctor_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_b655c257c4dcdb13f4f75b69226" FOREIGN KEY ("patientProfileId") REFERENCES "patient_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_b655c257c4dcdb13f4f75b69226"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_141cca7add8c704a1b8f99ed5b3"`);
        await queryRunner.query(`DROP TABLE "appointment"`);
        await queryRunner.query(`DROP TYPE "public"."appointment_status_enum"`);
    }

}
