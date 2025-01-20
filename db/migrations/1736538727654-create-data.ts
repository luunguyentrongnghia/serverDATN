import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateData1736538727654 implements MigrationInterface {
    name = 'CreateData1736538727654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "province" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_4f461cb46f57e806516b7073659" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ward" ("id" integer NOT NULL, "name" character varying NOT NULL, "districtId" integer, CONSTRAINT "PK_e6725fa4a50e449c4352d2230e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "district" ("id" integer NOT NULL, "name" character varying NOT NULL, "provinceId" integer, CONSTRAINT "PK_ee5cb6fd5223164bb87ea693f1e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "package_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "isShowDecription" boolean NOT NULL DEFAULT false, "isShowDetails" boolean NOT NULL DEFAULT false, "isShowContactInfo" boolean NOT NULL DEFAULT false, "isShowOwnerName" boolean NOT NULL DEFAULT false, "price" bigint NOT NULL, "priority_level" integer NOT NULL, "color" character varying(7), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_43f2b426ce0dcffe9c529d51d78" UNIQUE ("priority_level"), CONSTRAINT "PK_1d2a2de151b8e5076ae9de7ebd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Property_images" ("id" character varying NOT NULL, "propertyId" uuid NOT NULL, "image_url" character varying NOT NULL, "is_main" boolean NOT NULL DEFAULT false, "caption" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e71af6bcac0c0aafad645cb538f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."property_types_listingtype_enum" AS ENUM('bán', 'cho thuê')`);
        await queryRunner.query(`CREATE TABLE "property_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "listingType" "public"."property_types_listingtype_enum" NOT NULL DEFAULT 'bán', "direction" boolean NOT NULL DEFAULT false, "balonDirection" boolean NOT NULL DEFAULT false, "floor" boolean NOT NULL DEFAULT false, "bedroom" boolean NOT NULL DEFAULT false, "bathroom" boolean NOT NULL DEFAULT false, "isFurniture" boolean NOT NULL DEFAULT false, "Road" boolean NOT NULL DEFAULT false, "Legal" boolean NOT NULL DEFAULT false, "ResidentialArea" boolean NOT NULL DEFAULT false, "Horizontal" boolean NOT NULL DEFAULT false, "Length" boolean NOT NULL DEFAULT false, "Land_status" boolean NOT NULL DEFAULT false, "Deposit_amount" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_129390b286b9c776438dfa475a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."report_property_status_enum" AS ENUM('pending', 'approved')`);
        await queryRunner.query(`CREATE TABLE "report_property" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "status" "public"."report_property_status_enum" NOT NULL DEFAULT 'pending', "assess" character varying, "reason" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "postId" uuid, CONSTRAINT "PK_1024ab67a9fd1b7896a73acf39a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."Properties_status_enum" AS ENUM('pending', 'approved', 'rejected', 'draft', 'expired')`);
        await queryRunner.query(`CREATE TABLE "Properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "address" character varying NOT NULL, "price" bigint NOT NULL, "square_meter" integer NOT NULL, "description" character varying, "floor" integer NOT NULL DEFAULT '0', "bedroom" integer NOT NULL DEFAULT '0', "bathroom" integer NOT NULL DEFAULT '0', "isFurniture" character varying, "direction" character varying, "balonDirection" character varying, "Road" character varying, "Legal" character varying, "ResidentialArea" integer NOT NULL DEFAULT '0', "Horizontal" integer NOT NULL DEFAULT '0', "Length" integer NOT NULL DEFAULT '0', "Land_status" character varying, "Deposit_amount" character varying, "totalCost" integer, "status" "public"."Properties_status_enum" NOT NULL DEFAULT 'draft', "displayDays" integer, "start_date" TIMESTAMP, "end_date" TIMESTAMP, "postedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "provinceId" integer, "districtId" integer, "wardId" integer, "propertyTypeIdId" uuid, "idUserId" uuid, "packageTypeId" uuid, CONSTRAINT "PK_0840069eb699a18f3ad6e829ae8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transaction_type" character varying NOT NULL DEFAULT 'Mua gói tin', "amount" integer NOT NULL, "method" character varying NOT NULL, "balance" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "idUserId" uuid, CONSTRAINT "PK_7761bf9766670b894ff2fdb3700" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "fullname" character varying NOT NULL, "emailVerified" boolean NOT NULL DEFAULT false, "password" character varying NOT NULL, "avatar" character varying, "avatar_id" character varying, "role" character varying NOT NULL DEFAULT 'user', "otp" character varying, "resetPwdOtp" character varying, "balance" bigint NOT NULL DEFAULT '0', "googleId" character varying, "isActive" boolean, "address" character varying, "status" character varying NOT NULL DEFAULT 'open', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "provinceId" integer, "districtId" integer, "wardId" integer, CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."inquiries_status_enum" AS ENUM('pending', 'approved')`);
        await queryRunner.query(`CREATE TABLE "inquiries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying NOT NULL, "infor" character varying NOT NULL, "url" character varying NOT NULL, "status" "public"."inquiries_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "sellerUserId" uuid, "contactUserId" uuid, "propertyIdId" uuid, CONSTRAINT "PK_ceacaa439988b25eb9459e694d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ward" ADD CONSTRAINT "FK_19a3bc9b3be291e8b9bc2bb623b" FOREIGN KEY ("districtId") REFERENCES "district"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "district" ADD CONSTRAINT "FK_23a21b38208367a242b1dd3a424" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Property_images" ADD CONSTRAINT "FK_7723bdd55597a2978a542c42395" FOREIGN KEY ("propertyId") REFERENCES "Properties"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "report_property" ADD CONSTRAINT "FK_dded2974cc120d58762a4a313e6" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "report_property" ADD CONSTRAINT "FK_ff18c3ba7fd1f97a8b2a539f543" FOREIGN KEY ("postId") REFERENCES "Properties"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "Properties" ADD CONSTRAINT "FK_27e52499d2020b93d83181e6593" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Properties" ADD CONSTRAINT "FK_346aa3dd4c7755f66dd255a3f37" FOREIGN KEY ("districtId") REFERENCES "district"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Properties" ADD CONSTRAINT "FK_e319307b10b4f5047d4ff7bcb4a" FOREIGN KEY ("wardId") REFERENCES "ward"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Properties" ADD CONSTRAINT "FK_f8bb8d122bbe0031da4599f007d" FOREIGN KEY ("propertyTypeIdId") REFERENCES "property_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Properties" ADD CONSTRAINT "FK_72eeebb1b1187157f3e1bf52652" FOREIGN KEY ("idUserId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Properties" ADD CONSTRAINT "FK_0ce93aba25aeb55a054013a2847" FOREIGN KEY ("packageTypeId") REFERENCES "package_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Transactions" ADD CONSTRAINT "FK_ebb94d0ebe6daf19d5821236d1d" FOREIGN KEY ("idUserId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_1a338c19d53d86d941e550ec0a7" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_b99c111ade7499e4f4ac50ed284" FOREIGN KEY ("districtId") REFERENCES "district"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_682454af8d48ee36e10f8877a92" FOREIGN KEY ("wardId") REFERENCES "ward"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inquiries" ADD CONSTRAINT "FK_07bedd78315253e721f1a20a170" FOREIGN KEY ("sellerUserId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "inquiries" ADD CONSTRAINT "FK_46a8e28fb05b07d68307ee59951" FOREIGN KEY ("contactUserId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "inquiries" ADD CONSTRAINT "FK_1c86e054a726d192943f17ca98b" FOREIGN KEY ("propertyIdId") REFERENCES "Properties"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inquiries" DROP CONSTRAINT "FK_1c86e054a726d192943f17ca98b"`);
        await queryRunner.query(`ALTER TABLE "inquiries" DROP CONSTRAINT "FK_46a8e28fb05b07d68307ee59951"`);
        await queryRunner.query(`ALTER TABLE "inquiries" DROP CONSTRAINT "FK_07bedd78315253e721f1a20a170"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_682454af8d48ee36e10f8877a92"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_b99c111ade7499e4f4ac50ed284"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_1a338c19d53d86d941e550ec0a7"`);
        await queryRunner.query(`ALTER TABLE "Transactions" DROP CONSTRAINT "FK_ebb94d0ebe6daf19d5821236d1d"`);
        await queryRunner.query(`ALTER TABLE "Properties" DROP CONSTRAINT "FK_0ce93aba25aeb55a054013a2847"`);
        await queryRunner.query(`ALTER TABLE "Properties" DROP CONSTRAINT "FK_72eeebb1b1187157f3e1bf52652"`);
        await queryRunner.query(`ALTER TABLE "Properties" DROP CONSTRAINT "FK_f8bb8d122bbe0031da4599f007d"`);
        await queryRunner.query(`ALTER TABLE "Properties" DROP CONSTRAINT "FK_e319307b10b4f5047d4ff7bcb4a"`);
        await queryRunner.query(`ALTER TABLE "Properties" DROP CONSTRAINT "FK_346aa3dd4c7755f66dd255a3f37"`);
        await queryRunner.query(`ALTER TABLE "Properties" DROP CONSTRAINT "FK_27e52499d2020b93d83181e6593"`);
        await queryRunner.query(`ALTER TABLE "report_property" DROP CONSTRAINT "FK_ff18c3ba7fd1f97a8b2a539f543"`);
        await queryRunner.query(`ALTER TABLE "report_property" DROP CONSTRAINT "FK_dded2974cc120d58762a4a313e6"`);
        await queryRunner.query(`ALTER TABLE "Property_images" DROP CONSTRAINT "FK_7723bdd55597a2978a542c42395"`);
        await queryRunner.query(`ALTER TABLE "district" DROP CONSTRAINT "FK_23a21b38208367a242b1dd3a424"`);
        await queryRunner.query(`ALTER TABLE "ward" DROP CONSTRAINT "FK_19a3bc9b3be291e8b9bc2bb623b"`);
        await queryRunner.query(`DROP TABLE "inquiries"`);
        await queryRunner.query(`DROP TYPE "public"."inquiries_status_enum"`);
        await queryRunner.query(`DROP TABLE "Users"`);
        await queryRunner.query(`DROP TABLE "Transactions"`);
        await queryRunner.query(`DROP TABLE "Properties"`);
        await queryRunner.query(`DROP TYPE "public"."Properties_status_enum"`);
        await queryRunner.query(`DROP TABLE "report_property"`);
        await queryRunner.query(`DROP TYPE "public"."report_property_status_enum"`);
        await queryRunner.query(`DROP TABLE "property_types"`);
        await queryRunner.query(`DROP TYPE "public"."property_types_listingtype_enum"`);
        await queryRunner.query(`DROP TABLE "Property_images"`);
        await queryRunner.query(`DROP TABLE "package_types"`);
        await queryRunner.query(`DROP TABLE "district"`);
        await queryRunner.query(`DROP TABLE "ward"`);
        await queryRunner.query(`DROP TABLE "province"`);
    }

}
