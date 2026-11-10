-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "characters" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "growth_stage" VARCHAR(20) NOT NULL DEFAULT 'たまご',
    "experience" INTEGER NOT NULL DEFAULT 0,
    "personality_type" VARCHAR(50),
    "favorite_topics" JSONB NOT NULL DEFAULT '{}',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "died_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_statuses" (
    "character_id" UUID NOT NULL,
    "hunger" INTEGER NOT NULL DEFAULT 70,
    "energy" INTEGER NOT NULL DEFAULT 70,
    "friendship" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "character_statuses_pkey" PRIMARY KEY ("character_id")
);

-- CreateTable
CREATE TABLE "conversation_messages" (
    "id" BIGSERIAL NOT NULL,
    "character_id" UUID NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "care_actions" (
    "id" BIGSERIAL NOT NULL,
    "character_id" UUID NOT NULL,
    "action_type" VARCHAR(30) NOT NULL,
    "experience_delta" INTEGER NOT NULL,
    "hunger_delta" INTEGER NOT NULL,
    "energy_delta" INTEGER NOT NULL,
    "friendship_delta" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "care_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personality_analyses" (
    "id" BIGSERIAL NOT NULL,
    "character_id" UUID NOT NULL,
    "personality_type" VARCHAR(50) NOT NULL,
    "topic_summary" JSONB NOT NULL,
    "analysis_source_count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personality_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mini_game_results" (
    "id" BIGSERIAL NOT NULL,
    "character_id" UUID NOT NULL,
    "game_type" VARCHAR(30) NOT NULL,
    "result" VARCHAR(20) NOT NULL,
    "experience_delta" INTEGER NOT NULL,
    "friendship_delta" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mini_game_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "characters_user_id_key" ON "characters"("user_id");

-- CreateIndex
CREATE INDEX "conversation_messages_character_id_created_at_idx" ON "conversation_messages"("character_id", "created_at");

-- CreateIndex
CREATE INDEX "care_actions_character_id_created_at_idx" ON "care_actions"("character_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_hash_key" ON "password_reset_tokens"("token_hash");

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_statuses" ADD CONSTRAINT "character_statuses_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_messages" ADD CONSTRAINT "conversation_messages_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "care_actions" ADD CONSTRAINT "care_actions_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personality_analyses" ADD CONSTRAINT "personality_analyses_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mini_game_results" ADD CONSTRAINT "mini_game_results_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
