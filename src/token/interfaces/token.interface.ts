export interface ITokenize {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  userId?: string;
  uuid?: string;
}

export type TokenDetails = {
  userId: string;
  token: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
};
