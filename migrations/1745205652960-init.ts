import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1745205652960 implements MigrationInterface {
    name = 'Init1745205652960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projects" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL, "project_id" bigint NOT NULL, "company_id" character varying NOT NULL, "name" character varying NOT NULL, "project_type" character varying, "number" character varying, "status" character varying, CONSTRAINT "uq_project_project_id" UNIQUE ("project_id"), CONSTRAINT "uq_project_name" UNIQUE ("name"), CONSTRAINT "PK_d67986984da09db4b9998a42b6b" PRIMARY KEY ("id", "project_id"))`);
        await queryRunner.query(`CREATE TABLE "companies" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL, "company_id" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "uq_Companies_company_id" UNIQUE ("company_id"), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_Companies_company_id" ON "companies" ("company_id") `);
        await queryRunner.query(`CREATE TABLE "suppliers" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL, "supplier_id" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "uq_Suppliers_supplier_id" UNIQUE ("supplier_id"), CONSTRAINT "PK_b70ac51766a9e3144f778cfe81e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_Suppliers_supplier_id" ON "suppliers" ("supplier_id") `);
        await queryRunner.query(`CREATE TABLE "jobs_failed" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL, "job_key" character varying NOT NULL, "queue_name" character varying NOT NULL, "payloads" text NOT NULL, "target" character varying NOT NULL, "type_identifier" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "uq_JobFailed_job_key" UNIQUE ("job_key"), CONSTRAINT "PK_81e4f95708db6a6cec74305f733" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customers" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL, "customer_id" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "uq_Customer_customer_id" UNIQUE ("customer_id"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_Customer_customer_id" ON "customers" ("customer_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_Customer_customer_id"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "jobs_failed"`);
        await queryRunner.query(`DROP INDEX "public"."idx_Suppliers_supplier_id"`);
        await queryRunner.query(`DROP TABLE "suppliers"`);
        await queryRunner.query(`DROP INDEX "public"."idx_Companies_company_id"`);
        await queryRunner.query(`DROP TABLE "companies"`);
        await queryRunner.query(`DROP TABLE "projects"`);
    }

}
