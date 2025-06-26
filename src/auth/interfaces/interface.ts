export interface JwtPayload {
  sub: string;
  userId: string;
  username: string;
  iat: number;
  exp: number;
}
