/*
  Warnings:

  - Added the required column `roomId` to the `rtc_socket_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rtc_socket_user" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "roomId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "rtc_socket_room" (
    "id" SERIAL NOT NULL,
    "room_id" TEXT NOT NULL,
    "room_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "rtc_socket_room_pkey" PRIMARY KEY ("room_id")
);

-- CreateTable
CREATE TABLE "rtc_socket_room_user" (
    "id" SERIAL NOT NULL,
    "room_user_id" TEXT NOT NULL,

    CONSTRAINT "rtc_socket_room_user_pkey" PRIMARY KEY ("room_user_id")
);

-- AddForeignKey
ALTER TABLE "rtc_socket_user" ADD CONSTRAINT "rtc_socket_user_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rtc_socket_room"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;
