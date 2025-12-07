export interface JwtPayload {
  sub: string;
  email: string;
  isOAuth?: boolean;
  provider?: string;
  username?: string;
  picture?: string;
  firstName?: string;
  lastName?: string;
}
