ALTER TABLE "users"
  ADD COLUMN "firebase_uid" VARCHAR(128),
  ALTER COLUMN "password_hash" DROP NOT NULL;

CREATE UNIQUE INDEX "users_firebase_uid_key" ON "users"("firebase_uid");
