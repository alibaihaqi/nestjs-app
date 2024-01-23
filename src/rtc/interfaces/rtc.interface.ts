export interface IRtcClientRequest {
  roomId?: string;
  connectionId: string;
}

export interface IRtcRoom {
  roomId: string;
  includeUsers?: boolean;
}
