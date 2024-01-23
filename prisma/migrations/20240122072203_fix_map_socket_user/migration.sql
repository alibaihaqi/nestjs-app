/*
  Warnings:

  - You are about to drop the column `roomId` on the `rtc_socket_user` table. All the data in the column will be lost.
  - Added the required column `room_id` to the `rtc_socket_user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "rtc_socket_user" DROP CONSTRAINT "rtc_socket_user_roomId_fkey";

-- AlterTable
ALTER TABLE "rtc_socket_user" DROP COLUMN "roomId",
ADD COLUMN     "room_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "rtc_socket_user" ADD CONSTRAINT "rtc_socket_user_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rtc_socket_room"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;
