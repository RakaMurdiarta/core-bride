import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1743735483021 implements MigrationInterface {
    name = 'Init1743735483021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projects" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL, "project_id" bigint NOT NULL, "company_id" character varying NOT NULL, "name" character varying NOT NULL, "project_type" character varying, "number" character varying, "status" character varying, CONSTRAINT "uq_project_project_id" UNIQUE ("project_id"), CONSTRAINT "uq_project_name" UNIQUE ("name"), CONSTRAINT "PK_d67986984da09db4b9998a42b6b" PRIMARY KEY ("id", "project_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "projects"`);
    }

}
