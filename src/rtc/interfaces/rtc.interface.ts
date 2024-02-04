export interface IRtcClientRequest {
  connectionId: string;
  name?: string;
  roomId?: string;
}

export interface IRtcRoom {
  roomId: string;
  includeUsers?: boolean;
  name?: string;
}

export interface IRtcSignal {
  connectionId: string;
  signal: any;
}
