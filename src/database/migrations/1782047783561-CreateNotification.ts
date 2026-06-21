import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotification1782047783561 implements MigrationInterface {
    name = 'CreateNotification1782047783561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "message" text NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "patientProfileId" integer, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_ff4b2610fb9f5051f7d570954e0" FOREIGN KEY ("patientProfileId") REFERENCES "patient_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_ff4b2610fb9f5051f7d570954e0"`);
        await queryRunner.query(`DROP TABLE "notification"`);
    }

}
