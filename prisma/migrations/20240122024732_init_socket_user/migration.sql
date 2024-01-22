-- CreateTable
CREATE TABLE "rtc_socket_user" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "connection_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rtc_socket_user_pkey" PRIMARY KEY ("user_id")
);
