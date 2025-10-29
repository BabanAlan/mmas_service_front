CREATE TABLE "students"(
    "id" UUID NOT NULL,
    "studio_id" UUID NOT NULL,
    "mmas_id" VARCHAR(255) NOT NULL,
    "hashed_password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "birth" DATE NOT NULL,
    "belt_id" UUID NOT NULL,
    "balance" BIGINT NOT NULL DEFAULT '0'
);
ALTER TABLE
    "students" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "students"."mmas_id" IS 'Формируется из studios.short и studios.num_students';
CREATE TABLE "belts"(
    "id" UUID NOT NULL,
    "belt" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "belts" ADD PRIMARY KEY("id");
CREATE TABLE "studios"(
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "short" VARCHAR(255) NOT NULL,
    "num_students" BIGINT NOT NULL
);
ALTER TABLE
    "studios" ADD PRIMARY KEY("id");
CREATE TABLE "attendance"(
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "hours" TIME(0) WITHOUT TIME ZONE NOT NULL,
    "train_date" TIMESTAMP(0) WITH
        TIME zone NOT NULL,
        "paid_by" VARCHAR(255)
    CHECK
        ("paid_by" IN('')) NOT NULL,
        "event_id" UUID NOT NULL,
        "studio_id" DECIMAL(8, 2) NOT NULL
);
ALTER TABLE
    "attendance" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "attendance"."paid_by" IS 'unpaid, money, time_abonnement, hours_abonnement, other';
CREATE TABLE "pay_logs"(
    "id" UUID NOT NULL,
    "amount" DECIMAL(8, 2) NOT NULL,
    "yookassa_id" VARCHAR(255) NOT NULL,
    "student_id" UUID NOT NULL,
    "status" VARCHAR(255) NOT NULL DEFAULT '"pending"',
    "user_email" VARCHAR(255) NULL,
    "created_at" TIMESTAMP(0) WITH
        TIME zone NOT NULL DEFAULT 'now'
);
ALTER TABLE
    "pay_logs" ADD PRIMARY KEY("id");
CREATE INDEX "pay_logs_amount_index" ON
    "pay_logs"("amount");
ALTER TABLE
    "pay_logs" ADD CONSTRAINT "pay_logs_yookassa_id_unique" UNIQUE("yookassa_id");
CREATE INDEX "pay_logs_student_id_index" ON
    "pay_logs"("student_id");
CREATE INDEX "pay_logs_status_index" ON
    "pay_logs"("status");
COMMENT
ON COLUMN
    "pay_logs"."amount" IS 'переброс данных в students.balance';
COMMENT
ON COLUMN
    "pay_logs"."yookassa_id" IS 'не ебу какой тип';
CREATE TABLE "balance_logs"(
    "id" UUID NOT NULL,
    "operation_type" VARCHAR(255) CHECK
        ("operation_type" IN('')) NOT NULL,
        "student_id" UUID NOT NULL,
        "amount" DECIMAL(8, 2) NOT NULL,
        "comment" VARCHAR(255) NULL,
        "created_at" TIMESTAMP(0)
    WITH
        TIME zone NOT NULL
);
ALTER TABLE
    "balance_logs" ADD PRIMARY KEY("id");
CREATE INDEX "balance_logs_operation_type_index" ON
    "balance_logs"("operation_type");
CREATE INDEX "balance_logs_student_id_index" ON
    "balance_logs"("student_id");
CREATE INDEX "balance_logs_amount_index" ON
    "balance_logs"("amount");
CREATE TABLE "events"(
    "id" UUID NOT NULL,
    "type" VARCHAR(255) CHECK
        ("type" IN('')) NOT NULL,
        "price" DECIMAL(8, 2) NOT NULL,
        "description" VARCHAR(255) NULL,
        "studio_id" UUID NOT NULL
);
ALTER TABLE
    "events" ADD PRIMARY KEY("id");
CREATE TABLE "tg_users"(
    "id" UUID NOT NULL,
    "tg_id" UUID NOT NULL
);
ALTER TABLE
    "tg_users" ADD PRIMARY KEY("id");
CREATE TABLE "app_accounts"(
    "id" UUID NOT NULL,
    "tg_id" UUID NOT NULL,
    "mmas_id" UUID NOT NULL
);
ALTER TABLE
    "app_accounts" ADD PRIMARY KEY("id");
CREATE TABLE "aboniments"(
    "id" UUID NOT NULL,
    "student_id" UUID NULL,
    "studio_id" UUID NOT NULL,
    "hours" SMALLINT NULL,
    "end_date" DATE NULL
);
ALTER TABLE
    "aboniments" ADD PRIMARY KEY("id");
ALTER TABLE
    "attendance" ADD CONSTRAINT "attendance_event_id_foreign" FOREIGN KEY("event_id") REFERENCES "events"("id");
ALTER TABLE
    "attendance" ADD CONSTRAINT "attendance_student_id_foreign" FOREIGN KEY("student_id") REFERENCES "students"("id");
ALTER TABLE
    "students" ADD CONSTRAINT "students_studio_id_foreign" FOREIGN KEY("studio_id") REFERENCES "studios"("id");
ALTER TABLE
    "students" ADD CONSTRAINT "students_mmas_id_foreign" FOREIGN KEY("mmas_id") REFERENCES "app_accounts"("mmas_id");
ALTER TABLE
    "aboniments" ADD CONSTRAINT "aboniments_student_id_foreign" FOREIGN KEY("student_id") REFERENCES "students"("id");
ALTER TABLE
    "balance_logs" ADD CONSTRAINT "balance_logs_student_id_foreign" FOREIGN KEY("student_id") REFERENCES "students"("id");
ALTER TABLE
    "students" ADD CONSTRAINT "students_belt_id_foreign" FOREIGN KEY("belt_id") REFERENCES "belts"("id");
ALTER TABLE
    "events" ADD CONSTRAINT "events_studio_id_foreign" FOREIGN KEY("studio_id") REFERENCES "studios"("id");
ALTER TABLE
    "tg_users" ADD CONSTRAINT "tg_users_tg_id_foreign" FOREIGN KEY("tg_id") REFERENCES "app_accounts"("tg_id");