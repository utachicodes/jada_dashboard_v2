// types/responseTypes.ts

export interface SuccessResponse {
  STATUS_CODE: number;
  MESSAGE: string;
  TYPE : string;
}

export interface ErrorResponse {
  STATUS_CODE: number;
  TYPE: string;
  MESSAGE: string;
}

export interface SimpleError {
  TYPE: string;
  MESSAGE: string;
}

export interface DefaultError {
  STATUS_CODE_TEXT: string;
  STATUS_CODE: number;
  MESSAGE: string;
}
