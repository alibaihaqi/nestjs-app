-- DropForeignKey
ALTER TABLE "rtc_socket_user" DROP CONSTRAINT "rtc_socket_user_room_id_fkey";

-- AlterTable
ALTER TABLE "rtc_socket_user" ALTER COLUMN "room_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "rtc_socket_user" ADD CONSTRAINT "rtc_socket_user_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rtc_socket_room"("room_id") ON DELETE SET NULL ON UPDATE CASCADE;
