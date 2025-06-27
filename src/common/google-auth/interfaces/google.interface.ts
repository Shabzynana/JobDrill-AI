import { ITokenize } from "src/token/interfaces/token.interface";

export interface googleAccessToken extends ITokenize {
    scope: string;
}

export interface googleProfile {
  id: string;
  email: string;
  verified_email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}