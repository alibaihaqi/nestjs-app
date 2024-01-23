export interface IRtcConnectClient {
  connectionId: string;
}

export interface IRtcClientRequest {
  roomId?: string;
  connectionId: string;
}

export interface IRtcCheckRoomRequest {
  roomId: string;
}
