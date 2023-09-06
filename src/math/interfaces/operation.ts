export interface ISumRequest {
  number: number;
}

export interface ISumResponse {
  success: boolean;
  result: number;
  timeInMili: number;
}
