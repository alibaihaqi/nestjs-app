/*
  Warnings:

  - A unique constraint covering the columns `[connection_id]` on the table `rtc_socket_user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "rtc_socket_user_connection_id_key" ON "rtc_socket_user"("connection_id");
